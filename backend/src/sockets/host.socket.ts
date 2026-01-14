import { Server, Socket } from "socket.io";
import store from "../store/memory.store";
import { v4 as uuid } from "uuid";

export default function hostSocket(io: Server, socket: Socket) {
  socket.on("host_action", ({ roomId, userId, action }) => {
    const room = store.getRoom(roomId);
    if (!room) return;

    // 🔒 Host validation
    if (room.hostId !== userId) return;

    switch (action.type) {
      case "START_NEXT_PLAYER": {
        const player = action.player;
        const auction = store.createAuction(roomId);

        auction.currentPlayerId = player.id;
        auction.currentBid = player.basePrice;
        auction.highestBidderId = undefined;
        auction.highestBidderTeamId = undefined;
        auction.status = "bidding";

        io.to(roomId).emit("player_started", auction);
        break;
      }

      case "MARK_UNSOLD": {
        const auction = store.getAuction(roomId);
        if (!auction) return;

        auction.status = "unsold";
        io.to(roomId).emit("player_unsold", auction);
        break;
      }

      case "FINALIZE_SALE": {
        const auction = store.getAuction(roomId);
        if (!auction || !auction.highestBidderTeamId) return;

        auction.status = "sold";
        io.to(roomId).emit("player_sold", auction);
        break;
      }

      case "SKIP_SET": {
        io.to(roomId).emit("set_skipped", action.setNo);
        break;
      }
    }
  });
}
