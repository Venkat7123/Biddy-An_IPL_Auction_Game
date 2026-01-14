import React, { useState } from 'react';
import { UserSession, GameRoom, TeamState, PlayerPoolItem, SquadPlayer } from './types';
import { TEAMS, TEAM_RETENTIONS, PLAYERS } from './constants';
import { roomStore } from './services/roomStore';

interface HomeProps {
  onJoinRoom?: (room: GameRoom) => void;
  existingUser: UserSession;
  onUpdateName: (name: string) => void;
}

const Home: React.FC<HomeProps> = ({ onJoinRoom, existingUser, onUpdateName }) => {
  const [roomCode, setRoomCode] = useState('');
  const publicRoomsList = roomStore.getPublicRooms();

  const isNameValid = existingUser.name.trim().length > 0;

  const createRoom = (isPublic: boolean) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

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
        retainedCount: ret.players.length
      };
    });

    const playersPool: Record<string, PlayerPoolItem> = {};
    PLAYERS.forEach(p => {
      playersPool[p.id] = { status: 'PENDING' };
    });

    const newRoom: GameRoom = {
      id: roomId,
      name: `${existingUser.name}'s Mega Auction`,
      hostId: existingUser.id,
      roomType: isPublic ? 'PUBLIC' : 'PRIVATE',
      status: 'lobby',
      players: {
        [existingUser.id]: { name: existingUser.name, teamId: null, isAdmin: true, isSpectator: false }
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
        bidIncrement: 0.1
      },
      chat: [{
        id: 'sys-1',
        senderName: 'System',
        text: `Mega Auction Room ${roomId} is ready.`,
        type: 'system',
        timestamp: Date.now()
      }],
    };

    if (isPublic) {
      roomStore.addPublicRoom(newRoom);
    }
    
    onJoinRoom?.(newRoom);
  };

  const joinByCode = () => {
    const found = publicRoomsList.find(r => r.id === roomCode.toUpperCase());
    if (found) {
      // Add current user to the room's players
      const updatedRoom = {
        ...found,
        players: {
          ...found.players,
          [existingUser.id]: { name: existingUser.name, teamId: null, isAdmin: false, isSpectator: false }
        }
      };
      roomStore.addPublicRoom(updatedRoom); // Update the room in store
      onJoinRoom?.(updatedRoom);
    } else {
      alert("Room not found. Only active public arenas can be joined via search.");
    }
  };

  return (
    <div className="min-h-screen auction-gradient flex flex-col items-center justify-start p-6 pt-12 md:pt-20">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter">IPL MEGA AUCTION</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">2025 Real-Time Engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 flex flex-col justify-center">
                <p className="text-[10px] font-black pb-2 text-slate-500 uppercase tracking-widest mb-1">Manager Identity</p>
                <div className="flex justify-between bg-slate-950 p-2 rounded-lg gap-2">
                  <input
                    type="text"
                    value={existingUser.name}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="bg-transparent text-l font-black text-white outline-none border-b-2 border-transparent transition-all w-full"
                    placeholder="Enter your Name..."
                  />
                  <span className="text-2xl shrink-0">🔥</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => createRoom(true)}
                  disabled={!isNameValid}
                  className={`bg-blue-600 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest
    ${!isNameValid ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-500 active:scale-95'}`}
                >
                  Create Public Auction
                </button>
                <button
                  onClick={() => createRoom(false)}
                  disabled={!isNameValid}
                  className={`bg-purple-600 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest
    ${!isNameValid ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-500 active:scale-95'}`}
                >
                  Create Private Auction
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700"></span></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="px-2 bg-slate-800 text-slate-500">Search Live Arena</span></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-black uppercase tracking-widest focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  placeholder="ENTER ROOM CODE"
                />
                <button onClick={joinByCode} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs active:scale-95">Join</button>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col h-[400px]">
              <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active Public Arenas
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {publicRoomsList.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-600 text-[10px] uppercase font-black italic">No public arenas live yet.</p>
                  </div>
                ) : (
                  publicRoomsList.map(room => {
                    const handleJoinRoom = () => {
                      // Add current user to the room's players
                      const updatedRoom = {
                        ...room,
                        players: {
                          ...room.players,
                          [existingUser.id]: { name: existingUser.name, teamId: null, isAdmin: false, isSpectator: false }
                        }
                      };
                      roomStore.updatePublicRoom(updatedRoom);
                      onJoinRoom?.(updatedRoom);
                    };
                    
                    return (
                      <div key={room.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-slate-500 transition-all">
                        <div className="min-w-0 pr-2">
                          <p className="text-white font-black text-sm truncate uppercase">{room.name}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Host: {room.players[room.hostId].name}</p>
                        </div>
                        <button
                          onClick={handleJoinRoom}
                          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase active:scale-95"
                        >
                          Join
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 text-center z-50 shadow-2xl">
        <p className="text-[10px] text-slate-500 font-bold">Made with ❤️ by Venkat</p>
      </div>
    </div>
  );
};

export default Home;
