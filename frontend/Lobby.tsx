
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameRoom, Player } from './types';
import { TEAMS } from './constants';
import socket from './services/socketClient';

interface LobbyProps {
  room: GameRoom;
  userId: string;
  userName: string;
  onLeave: () => void;
  setRoom: React.Dispatch<React.SetStateAction<GameRoom | null>>;
}

const Lobby: React.FC<LobbyProps> = ({ room, userId, userName, onLeave, setRoom }) => {
  const navigate = useNavigate();
  const isHost = room.hostId === userId;
  const playerList = Object.entries(room.players);
  const myPlayer = room.players[userId];
  const isSpectator = myPlayer?.isSpectator;
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    // Join room on mount
    socket.emit("join_room", { roomId: room.id, userId, userName });

    // Listen for updates
    const handleRoomUpdate = (updatedRoom: GameRoom) => {
      setRoom(updatedRoom);
    };

    socket.on("room_update", handleRoomUpdate);

    // Listen for errors
    const handleError = (err: { message: string }) => {
      setIsLaunching(false);
    };
    socket.on("error", handleError);

    // Listen for room being disbanded (host left)
    const handleDisbanded = ({ message }: { message: string }) => {
      alert(message);
      setRoom(null);
      localStorage.removeItem('ipl_auction_room');
      navigate('/');
    };
    socket.on("room_disbanded", handleDisbanded);

    return () => {
      socket.off("room_update", handleRoomUpdate);
      socket.off("error", handleError);
      socket.off("room_disbanded", handleDisbanded);
    };
  }, [room.id, userId, userName, setRoom]);

  // Navigate to auction when room goes LIVE
  useEffect(() => {
    if (room.status === 'LIVE') {
      navigate(`/auction/${room.id}`);
    }
  }, [room.status, room.id, navigate]);

  // Browser Back/Refresh Protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome requires this to be set
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const selectTeam = (teamId: string) => {
    // Removed restrictive check: allows any user (spectator or not) to select a team if available
    const isTaken = Object.entries(room.players).some(([pid, p]: any) => p.teamId === teamId && pid !== userId);
    if (isTaken) {
      return; // silently block
    }

    // OPTIMISTIC UPDATE REMOVED: Wait for server response to confirm selection
    // setRoom(prev => {
    //   if (!prev) return null;
    //   const updatedPlayers = { ...prev.players };
    //   updatedPlayers[userId] = { ...updatedPlayers[userId], teamId }; // Optimistic update
    //   return { ...prev, players: updatedPlayers };
    // });

    socket.emit("select_team", { roomId: room.id, userId, teamId });
  };

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(room.id);
    } catch (err) {
      console.error(err);
    }
  };

  const shareCode = async () => {
    const shareText = `Hey Buddy!! 😄\n\nAuction table is open!\nCome join my IPL Auction Game and create your ultimate squad.\nLet's see who becomes the real champion owner! 🏆👑\n\nJoin fast before players get sold out! 😉\n👉 ${window.location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Biddy - IPL Auction Game',
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startAuction = () => {
    if (!isHost || room.status === 'LIVE' || isLaunching) return;

    const activeManagers = Object.values(room.players).filter((p: any) => !p.isSpectator);
    const allTeamsSelected = activeManagers.every((p: any) => p.teamId);
    const managersWithTeams = activeManagers.filter((p: any) => p.teamId);

    if (!allTeamsSelected) {
      alert("Cannot start: All active managers must select a team.");
      return;
    }
    if (managersWithTeams.length < 2) {
      alert("Cannot start: At least 2 managers must join to start the auction.");
      return;
    }

    if (!confirm("Launch Mega Auction Arena? This will start the bidding floor for all managers.")) return;

    setIsLaunching(true);
    socket.emit("host_action", { roomId: room.id, userId, action: "START_AUCTION" });
  };

  const confirmExit = () => {
    if (confirm("Are you sure you want to exit the Lobby?")) {
      onLeave(); // App.tsx onLeave now handles socket.emit("leave_room") + cleanup
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pb-32 overflow-x-hidden">
      <div className="h-[120px] flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-8 lg:pl-[450px]">
        <div className="w-full lg:w-96 space-y-6 shrink-0 lg:fixed lg:top-8 lg:left-8 lg:w-96 lg:h-fit">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">War Room</h2>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{room.roomType} LOBBY</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Entry Key</span>
                  <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">READY</span>
                </div>
                <div className="text-4xl font-black text-white tracking-[0.25em] font-mono text-center py-2 select-all">
                  {room.id}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black py-3 rounded-xl transition-all uppercase flex items-center justify-center gap-2 border border-slate-700 active:scale-95"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={shareCode}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-3 rounded-xl transition-all uppercase flex items-center justify-center gap-2 border border-blue-500 active:scale-95"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">Commanders In Room</p>
              {playerList.map(([id, p]: any) => (
                <div key={id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${id === userId ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-800/40 border-slate-700'}`}>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${id === userId ? 'text-blue-400' : 'text-white'}`}>
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      {p.teamId ? TEAMS.find(t => t.id === p.teamId)?.name : 'Choosing team...'}
                    </span>
                  </div>
                  {p.isAdmin && <span className="text-yellow-400 text-lg">👑</span>}
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              {isHost && (
                <button
                  onClick={startAuction}
                  disabled={room.status === 'LIVE' || isLaunching}
                  className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95 ${room.status === 'LIVE' || isLaunching ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                >
                  {isLaunching ? 'Launching...' : 'Launch Mega Auction'}
                </button>
              )}
              <button onClick={confirmExit} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs">
                Leave Arena
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
          <div className="mb-6 shrink-0">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Franchise Selection</h2>
            <p className="text-slate-500 font-bold text-sm">Claim your team. The Bidding War starts when the host launches.</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {TEAMS.map((team) => {
                const ownerEntry = Object.entries(room.players).find(([_, p]) => p.teamId === team.id);
                const isOwnedByMe = myPlayer?.teamId === team.id;
                // isTaken if owner exists AND ownerId is NOT me
                const isTaken = ownerEntry && ownerEntry[0] !== userId;
                const owner = ownerEntry ? ownerEntry[1] : null;

                return (
                  <button
                    key={team.id}
                    disabled={isTaken}
                    onClick={() => selectTeam(team.id)}
                    className={`
                  relative group flex flex-col p-6 rounded-3xl border-2 transition-all text-left overflow-hidden h-48
                  ${isOwnedByMe ? 'bg-slate-800 border-blue-500 ring-4 ring-blue-500/10' : isTaken ? 'bg-slate-950 border-slate-800 opacity-40 cursor-not-allowed' : 'bg-slate-800 border-slate-700 hover:border-slate-400'}
                `}
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: team.color }} />
                    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                      <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="relative z-10 flex flex-col mb-auto">
                      <span className={`font-black text-4xl tracking-tighter leading-none ${isOwnedByMe ? 'text-blue-400' : 'text-white'}`}>{team.shortName}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{team.name}</span>
                    </div>
                    <div className="relative z-10 mt-6">
                      {isTaken ? (
                        <div className="text-[9px] font-black text-red-500 uppercase">Taken by {(owner as any).name}</div>
                      ) : (
                        <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-colors ${isOwnedByMe ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                          {isOwnedByMe ? 'Team Secured' : 'Claim Team'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 text-center z-50">
        <p className="text-[10px] text-slate-500 font-bold">Made with ❤️ by Venkat</p>
      </div>
    </div>
  );
};

export default Lobby;
