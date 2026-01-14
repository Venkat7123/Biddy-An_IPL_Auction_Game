import store from "../store/memory.store";
import { Server } from "socket.io";

const TICK_INTERVAL = 1000;

export function startAuctionTimer(io: Server, roomId: string, duration: number) {
  const auction = store.getAuction(roomId);
  if (!auction) return;

  auction.remainingTime = duration;
  auction.status = "bidding";

  const interval = setInterval(() => {
    const currentAuction = store.getAuction(roomId);
    if (!currentAuction || currentAuction.status !== "bidding") {
      clearInterval(interval);
      return;
    }

    currentAuction.remainingTime -= 1;

    io.to(roomId).emit("timer_update", {
      remainingTime: currentAuction.remainingTime,
    });

    if (currentAuction.remainingTime <= 0) {
      currentAuction.status = "ended";
      clearInterval(interval);

      io.to(roomId).emit("auction_ended", {
        roomId,
      });
    }
  }, TICK_INTERVAL);
}
