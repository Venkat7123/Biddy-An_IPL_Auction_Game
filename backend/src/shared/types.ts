export interface User {
  id: string;
  name: string;
  socketId?: string;
}

export interface Room {
  id: string;
  hostId: string;
  users: User[];
  status: "lobby" | "live" | "ended";
}

export interface Auction {
  roomId: string;

  // player
  currentPlayerId?: string;
  currentSetNo?: number;

  // bidding
  currentBid: number;
  highestBidderId?: string;
  highestBidderTeamId?: string;

  // timer
  remainingTime: number;

  // state
  status: "idle" | "bidding" | "rtm_pending" | "sold" | "unsold" | "ended";
}
