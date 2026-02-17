import { Server, Socket } from "socket.io";
import store from "../store/memory.store";
import { PLAYERS } from "../shared/constants"; // Import constants

export default function hostSocket(io: Server, socket: Socket) {
  socket.on("host_action", ({ roomId, userId, action, payload }) => {
    const room = store.getRoom(roomId);
    if (!room) return;

    if (room.hostId !== userId) return; // Only host can perform these actions

    switch (action) {
      case "START_AUCTION":
        // Validation: All active managers must have selected a team
        const activeManagers = Object.values(room.players).filter(p => !p.isSpectator);
        const allTeamsSelected = activeManagers.every(p => p.teamId);

        if (!allTeamsSelected) {
          // Notify all users via chat
          room.chat.push({
            id: Date.now().toString() + Math.random(),
            senderName: 'System',
            text: '⚠️ Cannot start: All active managers must select a team.',
            type: 'system',
            timestamp: Date.now()
          });
          io.to(roomId).emit("room_update", room);
          return;
        }

        const managersWithTeams = activeManagers.filter(p => p.teamId);
        if (managersWithTeams.length < 2) {
          room.chat.push({
            id: Date.now().toString() + Math.random(),
            senderName: 'System',
            text: '⚠️ Cannot start: At least 2 managers must join to start the auction.',
            type: 'system',
            timestamp: Date.now()
          });
          io.to(roomId).emit("room_update", room);
          return;
        }

        room.status = 'LIVE';
        io.to(roomId).emit("room_update", room);
        break;

      case "START_PLAYER":
        if (!payload || !payload.playerId) return;

        // Reset auction state for new player
        room.auction.status = 'bidding';
        room.auction.currentPlayerId = payload.playerId;

        // Get player details
        const playerDef = PLAYERS.find(p => p.id === payload.playerId);
        const basePrice = playerDef ? playerDef.basePrice : (payload.basePrice || 0);

        room.auction.currentBid = basePrice;
        room.auction.highestBidderId = null;
        room.auction.highestBidderTeamId = null;
        room.auction.timeLeft = room.auction.bidTimeLimit;
        room.auction.currentSetNo = payload.setNo;

        // Start Timer
        room.auction.auctionEndTime = Date.now() + (room.auction.bidTimeLimit * 1000);

        // Update player pool status
        if (room.playersPool[payload.playerId]) {
          room.playersPool[payload.playerId].status = 'LIVE';
        }

        io.to(roomId).emit("room_update", room);
        break;

      case "SOLD":
        if (room.auction.highestBidderTeamId && room.auction.currentPlayerId) {
          const teamId = room.auction.highestBidderTeamId;
          const price = room.auction.currentBid;
          const playerId = room.auction.currentPlayerId;

          const playerInfo = PLAYERS.find(p => p.id === playerId);
          if (!playerInfo) return;

          // Check for RTM Applicability
          // 1. Player must have a former team
          // 2. Former team must have RTM cards > 0
          // 3. Former team must NOT be the highest bidder
          if (playerInfo.formerTeamId) {
            const formerTeam = room.teams[playerInfo.formerTeamId];
            if (formerTeam && formerTeam.rtmCards > 0 && formerTeam.id !== teamId && formerTeam.ownerId) {
              // Trigger RTM Flow
              room.auction.status = 'rtm_pending';
              room.auction.rtmTeamId = formerTeam.id;
              room.auction.rtmTimeLeft = 10;
              room.auction.rtmStartTime = Date.now();
              io.to(roomId).emit("room_update", room);
              return; // Stop here, wait for RTM decision
            }
          }

          // If no RTM, finalize sale immediately
          finalizeSale(room, teamId, price, playerInfo, io, roomId);
          io.to(roomId).emit("room_update", room);
        }
        break;



      case "UNSOLD":
        if (room.auction.currentPlayerId) {
          const playerId = room.auction.currentPlayerId;
          const player = PLAYERS.find(p => p.id === playerId);
          room.auction.status = 'unsold';
          if (room.playersPool[playerId]) {
            room.playersPool[playerId].status = 'UNSOLD';
          }

          // System Chat Message
          if (player) {
            room.chat.push({
              id: Date.now().toString() + Math.random(),
              senderName: 'System',
              text: `${player.name} remains UNSOLD.`,
              type: 'system',
              timestamp: Date.now()
            });
          }

          io.to(roomId).emit("room_update", room);
        }
        break;

      case "SKIP_SET":
        // Logic: Mark all players in current set as UNSOLD
        if (room.auction.currentSetNo) {
          const setNo = room.auction.currentSetNo;
          const playersInSet = PLAYERS.filter(p => p.setNo === setNo);

          playersInSet.forEach(p => {
            if (room.playersPool[p.id] && room.playersPool[p.id].status === 'PENDING') {
              room.playersPool[p.id].status = 'UNSOLD';
            }
          });

          room.chat.push({
            id: Date.now().toString() + Math.random(),
            senderName: 'System',
            text: `Host skipped Set ${setNo}.`,
            type: 'system',
            timestamp: Date.now()
          });
        }

        room.auction.status = 'idle';
        room.auction.currentPlayerId = null;
        room.auction.currentBid = 0;
        io.to(roomId).emit("room_update", room);
        break;

      case "CHANGE_TIMER":
        if (payload && payload.limit) {
          room.auction.bidTimeLimit = payload.limit;

          // If currently bidding, update the end time to reflect the new limit from NOW
          // OR should it be from the last bid time?
          // Easiest is to just reset the clock to the new limit from NOW to give people time.
          if (room.auction.status === 'bidding') {
            room.auction.auctionEndTime = Date.now() + (payload.limit * 1000);
          }

          io.to(roomId).emit("room_update", room);

          room.chat.push({
            id: Date.now().toString() + Math.random(),
            senderName: 'System',
            text: `⏱️ Host changed bid timer to ${payload.limit}s.`,
            type: 'system',
            timestamp: Date.now()
          });
          io.to(roomId).emit("room_update", room);
        }
        break;

      case "END_AUCTION":
        room.status = 'finished';
        room.auction.status = 'idle';
        room.auction.currentPlayerId = null;
        room.auction.currentBid = 0;
        room.auction.highestBidderId = null;
        room.auction.highestBidderTeamId = null;

        room.chat.push({
          id: Date.now().toString() + Math.random(),
          senderName: 'System',
          text: '🏆 The Mega Auction has concluded! Check the Final Summary for results.',
          type: 'system',
          timestamp: Date.now()
        });

        io.to(roomId).emit("room_update", room);
        break;
    }
  });
}

// Helper to finalize sale
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
