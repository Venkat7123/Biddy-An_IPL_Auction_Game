import { Room, Auction, User } from "../shared/types";

class MemoryStore {
  rooms = new Map<string, Room>();
  auctions = new Map<string, Auction>();

  createAuction(roomId: string): Auction {
    const auction: Auction = {
      roomId,

      // player
      currentPlayerId: undefined,
      currentSetNo: undefined,

      // bidding
      currentBid: 0,
      highestBidderId: undefined,
      highestBidderTeamId: undefined,

      // timer
      remainingTime: 0,

      // state
      status: "idle",
    };

    this.auctions.set(roomId, auction);
    return auction;
  }
  getRoom(roomId: string) {
  return this.rooms.get(roomId);
}


  getAuction(roomId: string): Auction | undefined {
    return this.auctions.get(roomId);
  }

  updateBid(roomId: string, amount: number, userId: string, teamId: string) {
    const auction = this.auctions.get(roomId);
    if (!auction) return false;

    if (amount <= auction.currentBid) return false;

    auction.currentBid = amount;
    auction.highestBidderId = userId;
    auction.highestBidderTeamId = teamId;

    return true;
  }

  getRoomSnapshot(roomId: string) {
  const room = this.rooms.get(roomId);
  const auction = this.auctions.get(roomId);

  if (!room || !auction) return null;

  return {
    room,
    auction,
  };
}


  resetAuction(roomId: string) {
    const auction = this.auctions.get(roomId);
    if (!auction) return;

    auction.currentPlayerId = undefined;
    auction.currentSetNo = undefined;
    auction.currentBid = 0;
    auction.highestBidderId = undefined;
    auction.highestBidderTeamId = undefined;
    auction.remainingTime = 0;
    auction.status = "idle";
  }
}

const store = new MemoryStore();
export default store;
