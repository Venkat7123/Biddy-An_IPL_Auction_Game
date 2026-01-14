import { Server, Socket } from "socket.io";
import store from "../store/memory.store";
import { startAuctionTimer } from "../services/auctionTimer.service";

export default function auctionSocket(io: Server, socket: Socket) {
 socket.on("place_bid", ({ roomId, userId, teamId, amount }) => {
  if (!roomId || !userId || !teamId || !amount) return;

  const success = store.updateBid(roomId, amount, userId, teamId);

  if (!success) {
    socket.emit("bid_rejected", {
      reason: "Bid must be higher than current bid",
    });
    return;
  }

  const auction = store.getAuction(roomId);
  if (!auction) return;

  io.to(roomId).emit("auction_update", auction);
});

}
