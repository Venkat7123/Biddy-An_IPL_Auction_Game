import { Server, Socket } from "socket.io";
import store from "../store/memory.store";
import { PLAYERS } from "../shared/constants";

export default function auctionSocket(io: Server, socket: Socket) {
  socket.on("place_bid", ({ roomId, userId, amount }) => {
    const room = store.getRoom(roomId);
    if (!room) return;

    const player = room.players[userId];
    if (!player || player.isSpectator || !player.teamId) {
      socket.emit("error", { message: "Spectators cannot bid" });
      return;
    }

    const team = room.teams[player.teamId];
    if (!team) return;

    // Validation
    if (room.auction.status !== 'bidding') {
      socket.emit("error", { message: "Bidding not active" });
      return;
    }

    // Logic check:
    // If no bids yet (highestBidderId is null), allow bid >= basePrice (which is currentBid initially)
    // If bids exist, new bid must be > currentBid
    if (room.auction.highestBidderId) {
      if (amount <= room.auction.currentBid) {
        socket.emit("error", { message: "Bid must be higher than current bid" });
        return;
      }
    } else {
      // First bid. amount must be >= currentBid (basePrice)
      if (amount < room.auction.currentBid) {
        socket.emit("error", { message: "Bid must be at least base price" });
        return;
      }
    }

    if (team.purse < amount) {
      socket.emit("error", { message: "Insufficient purse" });
      return;
    }

    // Check if auction is expired
    if (room.auction.auctionEndTime && Date.now() > room.auction.auctionEndTime) {
      socket.emit("error", { message: "Bidding closed" });
      return;
    }

    // Update Auction State
    room.auction.currentBid = amount;
    room.auction.highestBidderId = userId;
    room.auction.highestBidderTeamId = player.teamId;

    // Reset Timer on server (extend)
    // room.auction.timeLeft matches bidTimeLimit
    // Set absolute end time
    room.auction.auctionEndTime = Date.now() + (room.auction.bidTimeLimit * 1000);

    io.to(roomId).emit("room_update", room);
  });

  socket.on("rtm_decision", ({ roomId, userId, decision }) => {
    const room = store.getRoom(roomId);
    if (!room) return;

    if (room.auction.status !== 'rtm_pending' || !room.auction.rtmTeamId) {
      socket.emit("error", { message: "RTM not active" });
      return;
    }

    // Authorization: RTM team owner OR room host can decide
    // Host needs access because the frontend auto-declines on timer expiry via the host's socket
    const rtmTeam = room.teams[room.auction.rtmTeamId];
    if (!rtmTeam || !rtmTeam.ownerId) return;

    const player = room.players[userId];
    const isRtmOwner = player && player.teamId === rtmTeam.id;
    const isHost = room.hostId === userId;

    if (!isRtmOwner && !isHost) {
      socket.emit("error", { message: "Not authorized for RTM" });
      return;
    }

    const playerInfo = PLAYERS.find(p => p.id === room.auction.currentPlayerId);

    if (decision === 'YES' && playerInfo && room.auction.highestBidderTeamId) {
      // RTM TAKEN
      const rtmTeamId = room.auction.rtmTeamId;

      // Deduct RTM Card
      if (rtmTeam.rtmCards > 0) {
        room.teams[rtmTeamId].rtmCards -= 1;
      }

      // Execute Sale to RTM Team
      // Price is the same as currentBid
      const price = room.auction.currentBid;
      finalizeSale(room, rtmTeamId, price, playerInfo, io, roomId);

      // Notify via chat
      room.chat.push({
        id: Date.now().toString(),
        senderName: 'System',
        text: `${rtmTeam.name} used RTM for ${playerInfo.name}!`,
        type: 'system',
        timestamp: Date.now()
      });

    } else if (playerInfo && room.auction.highestBidderTeamId) {
      // RTM DECLINED
      // Execute Sale to Original Bidder
      const originalTeamId = room.auction.highestBidderTeamId;
      const price = room.auction.currentBid;
      finalizeSale(room, originalTeamId, price, playerInfo, io, roomId);
    }

    io.to(roomId).emit("room_update", room);
  });
}

// Helper to finalize sale (Duplicated from host.socket.ts - strictly should be shared or imported, but keeping local for safety/speed)
function finalizeSale(room: any, teamId: string, price: number, playerInfo: any, io: Server, roomId: string) {
  if (room.teams[teamId]) {
    room.teams[teamId].purse -= price;
    room.teams[teamId].squad.push({
      ...playerInfo,
      boughtPrice: price,
      isRetained: false
    });

    // System Chat Message (Static)
    room.chat.push({
      id: Date.now().toString() + Math.random(),
      senderName: 'System',
      text: `${playerInfo.name} SOLD to ${room.teams[teamId].name} for ₹${price} Cr!`,
      type: 'system',
      timestamp: Date.now()
    });

  }

  room.auction.status = 'sold';
  if (room.playersPool[playerInfo.id]) {
    room.playersPool[playerInfo.id].status = 'SOLD';
    room.playersPool[playerInfo.id].winningTeamId = teamId;
    room.playersPool[playerInfo.id].finalPrice = price;
  }
}
