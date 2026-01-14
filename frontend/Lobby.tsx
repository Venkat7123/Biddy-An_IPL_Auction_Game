
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameRoom, Player } from './types';
import { TEAMS, PLAYERS } from './constants';

interface LobbyProps {
  room: GameRoom;
  userId: string;
  userName: string;
  onLeave: () => void;
  setRoom: React.Dispatch<React.SetStateAction<GameRoom | null>>;
  setToast?: (toast: { msg: string; type: 'success' | 'error' | 'info' }) => void;
}

const Lobby: React.FC<LobbyProps> = ({ room, userId, userName, onLeave, setRoom, setToast }) => {
  const navigate = useNavigate();
  const isHost = room.hostId === userId;
  const playerList = Object.entries(room.players);
  const myPlayer = room.players[userId];
  const isSpectator = myPlayer.isSpectator;
  const [isLaunching, setIsLaunching] = useState(false);

  // PERSIST ROOM CHANGES TO SESSIONSTORAGE
  useEffect(() => {
    sessionStorage.setItem('ipl_auction_room', JSON.stringify(room));
  }, [room]);

  // Navigate to auction when room goes LIVE
  useEffect(() => {
    if (room.status === 'LIVE') {
      navigate(`/auction/${room.id}`);
    }
  }, [room.status, room.id, navigate]);

  // Auto-spectator check for joining mid-auction
  useEffect(() => {
    if (room.status === 'LIVE' && !myPlayer.isSpectator && !myPlayer.teamId) {
       setRoom(prev => {
         if (!prev) return null;
         return {
           ...prev,
           players: { ...prev.players, [userId]: { ...prev.players[userId], isSpectator: true } }
         };
       });
    }
  }, [room.status]);

  const selectTeam = (teamId: string) => {
    if (isSpectator) return;
    const isTaken = Object.values(room.players).some((p: any) => p.teamId === teamId && p.name !== userName);
    if (isTaken) {
      alert("Franchise already claimed by another manager.");
      return;
    }

    setRoom(prev => {
      if (!prev) return null;
      const updatedPlayers = { ...prev.players };
      updatedPlayers[userId] = { ...updatedPlayers[userId], teamId };
      return { ...prev, players: updatedPlayers };
    });
  };

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(room.id);
      setToast?.({ msg: 'Room code copied!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast?.({ msg: 'Failed to copy code', type: 'error' });
    }
  };

  const shareCode = async () => {
    const shareText = `Join my IPL Mega Auction room! Code: ${room.id}\n${window.location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Biddy - IPL Auction Game',
          text: shareText
        });
        setToast?.({ msg: 'Shared successfully!', type: 'success' });
      } else {
        await navigator.clipboard.writeText(shareText);
        setToast?.({ msg: 'Share text copied!', type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startAuction = () => {
    if (!isHost || room.status === 'LIVE' || isLaunching) return;

    // Check if all non-spectator players have selected teams
    const allTeamsSelected = Object.values(room.players).every((p: any) => p.isSpectator || p.teamId);
    if (!allTeamsSelected) {
      alert("All managers must select a team before launching!");
      return;
    }

    if (!confirm("Launch Mega Auction Arena? This will start the bidding floor for all managers.")) return;
    
    setIsLaunching(true);

    // Select first player from the lowest setno available
    const minSetNo = Math.min(...PLAYERS.map(p => (typeof p.setNo === 'number' ? p.setNo : 1)));
    const firstSetPlayers = PLAYERS.filter(p => p.setNo === minSetNo);
    const firstPlayer = firstSetPlayers[Math.floor(Math.random() * firstSetPlayers.length)];

    setRoom(prev => {
      if (!prev) return null;
      
      const updatedTeams = { ...prev.teams };
      const updatedPool = { ...prev.playersPool };

      // Ensure every team has its owner linked if they selected it
      Object.keys(updatedTeams).forEach(tId => {
        const ownerEntry = Object.entries(prev.players).find(([_, p]: any) => p.teamId === tId);
        if (ownerEntry) {
          updatedTeams[tId] = { ...updatedTeams[tId], ownerId: ownerEntry[0] };
        }
      });

      // Set first player to LIVE
      updatedPool[firstPlayer.id] = { ...updatedPool[firstPlayer.id], status: 'LIVE' };

      return { 
        ...prev, 
        status: 'LIVE', 
        teams: updatedTeams,
        playersPool: updatedPool,
        auction: { 
          ...prev.auction, 
          status: 'bidding',
          currentPlayerId: firstPlayer.id,
          currentBid: firstPlayer.basePrice,
          highestBidderId: null,
          highestBidderTeamId: null,
          currentSetNo: minSetNo,
          timeLeft: prev.auction.bidTimeLimit 
        },
        chat: [...prev.chat, {
          id: `sys-start-${Date.now()}`,
          senderName: 'System',
          text: 'The Mega Auction is now LIVE! Opening lot: ' + firstPlayer.name,
          type: 'system',
          timestamp: Date.now()
        }]
      };
    });
  };

  const confirmExit = () => {
    if (confirm("Are you sure you want to exit the Lobby?")) onLeave();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pb-24 overflow-x-hidden">
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
            const owner = Object.values(room.players).find((p: any) => p.teamId === team.id);
            const isOwnedByMe = myPlayer.teamId === team.id;
            const isTaken = owner && (owner as any).name !== userName;

            return (
              <button
                key={team.id}
                disabled={isTaken || isSpectator}
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
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 text-center z-50 shadow-2xl">
        <p className="text-[10px] text-slate-500 font-bold">Made with ❤️ by Venkat</p>
      </div>
    </div>
  );
};

export default Lobby;
