
export type Role = 'BAT' | 'BOWL' | 'AR' | 'WK';

export interface UserSession {
  id: string;
  name: string;
  roomId: string | null;
}

export interface User { // Added for backend compatibility with existing code if needed, or alias UserSession
  id: string;
  name: string;
  socketId?: string;
}

export interface Player {
  id: string;
  name: string;
  role: Role;
  country: string;
  isOverseas: boolean;
  basePrice: number;
  setNo: number;
  formerTeamId?: string;
  cappedUncapped: string;
  age: number;
  slabCategory: string;
  previousIPLTeams: string;
  rtms?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
  logoUrl: string;
}

export interface SquadPlayer extends Player {
  boughtPrice: number;
  isRetained: boolean;
}

export interface TeamState {
  id: string;
  name: string;
  shortName: string;
  purse: number;
  squad: SquadPlayer[];
  rtmCards: number;
  ownerId?: string;
  retainedCount?: number;
  logoUrl?: string;
  color?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  type: 'user' | 'system';
  timestamp: number;
}

export interface PlayerPoolItem {
  status: 'PENDING' | 'LIVE' | 'SOLD' | 'UNSOLD';
  winningTeamId?: string;
  finalPrice?: number;
}

export interface GameRoom {
  id: string;
  name: string;
  hostId: string;
  status: 'lobby' | 'LIVE' | 'finished';
  roomType?: 'PUBLIC' | 'PRIVATE';
  players: Record<string, { teamId?: string | null; isSpectator: boolean; name: string; isAdmin?: boolean }>;
  teams: Record<string, TeamState>;
  playersPool: Record<string, PlayerPoolItem>;
  auction: {
    status: 'idle' | 'bidding' | 'rtm_pending' | 'sold' | 'unsold';
    currentPlayerId: string | null;
    currentBid: number;
    highestBidderId: string | null;
    highestBidderTeamId: string | null;
    currentSetNo: number | null;
    currentSlabCategory: string;
    bidTimeLimit: number;
    timeLeft: number;
    bidIncrement: number;
    biddingStartTime?: number;
    rtmStartTime?: number;
    rtmTeamId?: string | null;
    rtmTimeLeft?: number;
    slabIndex?: number;
    playerIndex?: number;
    auctionEndTime?: number; // timestamp in ms
  };
  chat: ChatMessage[];
  lastNotification?: {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
    duration: number;
  };
}
