
import { Router } from "express";
import { v4 as uuid } from "uuid";
import store from "../store/memory.store";
import { GameRoom, TeamState, SquadPlayer, PlayerPoolItem } from "../shared/types";
import { TEAMS, TEAM_RETENTIONS, PLAYERS } from "../shared/constants";
import { roomEvents } from "../shared/roomEvents";

const router = Router();

router.post("/", (req, res) => {
  const { hostName, isPublic, hostUserId } = req.body;
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const hostId = hostUserId || uuid();

  // --- GAME INITIALIZATION LOGIC (Ported from Frontend) ---

  const initialTeams: Record<string, TeamState> = {};
  TEAMS.forEach(t => {
    const ret = TEAM_RETENTIONS[t.id];
    const squad: SquadPlayer[] = ret.players.map(playerData => {
      const pName = playerData.name;
      const isOS = ["Matheesha Pathirana", "Nicholas Pooran", "Tristan Stubbs", "Heinrich Klaasen", "Pat Cummins", "Travis Head", "Rashid Khan", "Shimron Hetmyer"].includes(pName);
      return {
        id: `ret-${pName.replace(/\s+/g, '-').toLowerCase()}`,
        name: pName,
        country: playerData.country,
        role: playerData.role,
        basePrice: 0,
        cappedUncapped: 'Capped',
        age: 28,
        setNo: 0,
        slabCategory: 'Retained',
        previousIPLTeams: t.shortName,
        rtms: '',
        isOverseas: isOS,
        boughtPrice: ret.cost / ret.players.length,
        isRetained: true,
        formerTeamId: t.id
      };
    });

    initialTeams[t.id] = {
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      ownerId: '',
      purse: 120 - ret.cost,
      squad: squad,
      rtmCards: ret.rtm,
      retainedCount: ret.players.length,
      logoUrl: t.logoUrl,
      color: t.color
    };
  });

  const playersPool: Record<string, PlayerPoolItem> = {};
  PLAYERS.forEach(p => {
    playersPool[p.id] = { status: 'PENDING' };
  });

  const newRoom: GameRoom = {
    id: roomId,
    name: `${hostName}'s Mega Auction`,
    hostId: hostId,
    roomType: isPublic ? 'PUBLIC' : 'PRIVATE',
    status: 'lobby',
    players: {
      [hostId]: { name: hostName, teamId: null, isAdmin: true, isSpectator: false }
    },
    teams: initialTeams,
    playersPool,
    auction: {
      currentPlayerId: null,
      currentBid: 0,
      highestBidderId: null,
      highestBidderTeamId: null,
      status: 'idle',
      timeLeft: 15,
      bidTimeLimit: 15,
      rtmTimeLeft: 10,
      rtmTeamId: null,
      slabIndex: 0,
      playerIndex: 0,
      currentSetNo: null,
      currentSlabCategory: 'NONE',
      bidIncrement: 0.1,
      auctionEndTime: undefined
    },
    chat: [{
      id: 'sys-1',
      senderName: 'System',
      text: `Mega Auction Room ${roomId} is ready.`,
      type: 'system',
      timestamp: Date.now()
    }],
  };

  store.createRoom(newRoom);

  // Emit event for real-time updates
  roomEvents.emitRoomCreated(newRoom);

  res.json({
    roomId,
    userId: hostId,
    room: newRoom
  });
});

router.get("/:roomId/summary", (req, res) => {
  const room = store.rooms.get(req.params.roomId);
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

// Endpoint to list public rooms
router.get("/", (req, res) => {
  const publicRooms = Array.from(store.rooms.values())
    .filter(r => r.roomType === 'PUBLIC' && r.status !== 'finished')
    .map(r => ({
      id: r.id,
      name: r.name,
      hostName: r.players[r.hostId]?.name || 'Unknown',
      playersCount: Object.keys(r.players).length
    }));
  res.json(publicRooms);
});


export default router;
