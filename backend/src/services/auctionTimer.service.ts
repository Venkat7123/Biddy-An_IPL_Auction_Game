import store from "../store/memory.store";
import { Server } from "socket.io";

const TICK_INTERVAL = 1000;

export function startAuctionTimer(io: Server, roomId: string, duration: number) {
  const auction = store.getAuction(roomId);
  if (!auction) return; // Ensure auction exists

  auction.timeLeft = duration;
  auction.status = "bidding";

  const interval = setInterval(() => {
    const currentAuction = store.getAuction(roomId);
    if (!currentAuction || currentAuction.status !== "bidding") {
      clearInterval(interval);
      return;
    }

    currentAuction.timeLeft -= 1;

    io.to(roomId).emit("timer_update", {
      timeLeft: currentAuction.timeLeft,
    });

    if (currentAuction.timeLeft <= 0) {
      currentAuction.status = "sold"; // Or 'unsold' - logic depends on context, but 'ended' was not in type
      clearInterval(interval);

      io.to(roomId).emit("auction_ended", {
        roomId,
      });
    }
  }, TICK_INTERVAL);
}
