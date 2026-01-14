
import React from 'react';
import { GameRoom, Player } from '../types';
import { TEAMS } from '../constants';

interface MainPanelProps {
  room: GameRoom;
  userId: string;
  isHost: boolean;
  isSpectator: boolean;
  isBidding: boolean;
  timer: number;
  rtmTimer: number;
  currentPlayer: Player | null;
  myTeamId?: string;
  placeBid: () => void;
  startNextPlayer: () => void;
  finalizeSale: (rtmUsed: boolean) => void;
}

const MainPanel: React.FC<MainPanelProps> = ({
  room,
  userId,
  isHost,
  isSpectator,
  isBidding,
  timer,
  rtmTimer,
  currentPlayer,
  myTeamId,
  placeBid,
  startNextPlayer,
  finalizeSale
}) => {
  const isSold = room.auction.status === 'sold';
  const isUnsold = room.auction.status === 'unsold';
  const isIdle = room.auction.status === 'idle';
  const formerTeam = currentPlayer?.formerTeamId ? TEAMS.find(t => t.id === currentPlayer.formerTeamId) : null;
  const rtmEligibleTeamId = room.auction.rtmTeamId;
  const rtmEligibleTeam = rtmEligibleTeamId ? TEAMS.find(t => t.id === rtmEligibleTeamId) : null;
  const isMyRtm = rtmEligibleTeamId === myTeamId;

  if (isSold || isUnsold) {
    const winnerTeamId = currentPlayer ? room.playersPool[currentPlayer.id]?.winningTeamId : null;
    const winnerTeam = winnerTeamId ? TEAMS.find(t => t.id === winnerTeamId) : null;
    const finalPrice = currentPlayer ? room.playersPool[currentPlayer.id]?.finalPrice : 0;

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/50">
        <div className="text-center animate-in fade-in zoom-in duration-500 flex flex-col items-center">
          <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center mb-8 border-8 shadow-2xl relative transition-all duration-700
            ${isSold ? 'bg-green-500/10 border-green-500/50 scale-110' : 'bg-red-500/10 border-red-500/50'}`}>
            <span className={`text-6xl md:text-8xl transform transition-transform duration-300 ${isSold ? 'animate-bounce' : 'rotate-12'}`}>
              {isSold ? '🔨' : '🚫'}
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 ${isSold ? 'text-green-400' : 'text-red-500'}`}>
            {isSold ? 'Sold!' : 'Unsold'}
          </h2>
          
          {isSold && currentPlayer && (
            <div className="mt-4 animate-in slide-in-from-bottom-4 duration-700">
              <p className="text-white text-xl md:text-2xl font-black uppercase mb-3 flex items-center justify-center gap-2">
                {currentPlayer.name}
                {currentPlayer.isOverseas && <span title="Overseas">✈️</span>}
              </p>
              <div className="flex items-center justify-center gap-3 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800">
                <img src={winnerTeam?.logoUrl} alt={winnerTeam?.shortName} className="w-8 h-8 object-contain" />
                <span className="text-blue-400 font-black text-xl md:text-2xl uppercase">{winnerTeam?.name}</span>
              </div>
              <p className="text-green-400 text-3xl md:text-4xl font-black mt-6 tabular-nums">₹{finalPrice?.toFixed(2)} Cr</p>
            </div>
          )}

          {!isSold && currentPlayer && (
            <div className="mt-4 opacity-70">
              <p className="text-white text-lg md:text-xl font-bold uppercase flex items-center justify-center gap-2">
                {currentPlayer.name}
                {currentPlayer.isOverseas && <span title="Overseas">✈️</span>}
              </p>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-xs mt-2">No Bids Placed</p>
            </div>
          )}

          {isHost && (
            <button 
              onClick={startNextPlayer} 
              className="mt-12 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black px-8 md:px-12 py-4 md:py-5 rounded-3xl text-lg md:text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              Call Next Player
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isIdle) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/50">
        <div className="text-center flex flex-col items-center py-20 max-w-md">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 rounded-full flex items-center justify-center mb-8 border-8 border-slate-800 shadow-2xl relative">
            <span className="text-5xl md:text-6xl animate-pulse">⏳</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Ready to Roll</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
            The gavel is poised. Teams are ready. Budget checks complete. Let the mega auction begin.
          </p>
          {isHost && (
            <button 
              onClick={startNextPlayer} 
              className="mt-10 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black px-8 md:px-12 py-4 md:py-5 rounded-3xl text-lg md:text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              Start Auction
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 relative overflow-y-auto custom-scrollbar h-full bg-slate-950/30">
      <div className="w-full max-w-2xl py-4 md:py-8">
        <div className="flex flex-col items-center">
          <div className={`w-full bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-800 shadow-2xl relative transition-all ${isBidding ? 'scale-[1.02] ring-8 ring-yellow-400/10' : ''}`}>
            <div className="relative z-10 flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <span className="bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-widest">SET {currentPlayer?.setNo}</span>
                    {formerTeam && (
                      <div className="bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                        <img src={formerTeam.logoUrl} className="w-3 h-3 object-contain" alt="Former Team" />
                        RTM Available: {formerTeam.shortName}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter truncate flex items-center gap-3">
                    {currentPlayer?.name}
                    {currentPlayer?.isOverseas && <span className="text-3xl md:text-5xl" title="Overseas Player">✈️</span>}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                    <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase">{currentPlayer?.role} • {currentPlayer?.country}</span>
                    <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase">Base: ₹{currentPlayer?.basePrice}Cr</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2 md:mt-4">
                <div className="bg-slate-950 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 flex flex-col items-center justify-center shadow-inner">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 md:mb-4">Current High Bid</p>
                  <div className="flex items-baseline gap-1 md:gap-2">
                    <span className="text-4xl md:text-6xl font-black text-yellow-400 tracking-tighter tabular-nums">₹{room.auction.currentBid.toFixed(2)}</span>
                    <span className="text-lg md:text-2xl font-black text-yellow-400/40">Cr</span>
                  </div>
                  <p className="mt-4 md:mt-6 text-[10px] md:text-[11px] font-black uppercase text-white bg-slate-900 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-slate-800">
                    {room.auction.highestBidderTeamId ? `Leader: ${room.auction.highestBidderTeamId.toUpperCase()}` : 'OPENING BID'}
                  </p>
                </div>
                <div className="bg-slate-950 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 flex flex-col items-center justify-center shadow-inner">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 md:mb-6">Hammer Time</p>
                  <div className={`text-5xl md:text-7xl font-black tabular-nums ${timer < 5 && room.auction.status === 'bidding' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {room.auction.status === 'rtm_pending' ? rtmTimer : timer}s
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 md:mt-10">
            {room.auction.status === 'bidding' && !isSpectator && (
              <button
                onClick={placeBid}
                disabled={room.auction.highestBidderId === userId || !myTeamId}
                className={`w-full py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] text-2xl md:text-3xl font-black transition-all uppercase tracking-tighter shadow-2xl flex flex-col items-center justify-center gap-1 md:gap-2 ${room.auction.highestBidderId === userId ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-80' : 'bg-yellow-400 hover:bg-yellow-500 text-slate-950 active:scale-95'}`}
              >
                <span>{room.auction.highestBidderId === userId ? 'Leading' : 'RAISE BID'}</span>
              </button>
            )}

            {room.auction.status === 'rtm_pending' && (
              <div className="bg-indigo-900/60 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-indigo-500/50 text-center shadow-[0_0_80px_rgba(99,102,241,0.3)] animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-indigo-500">
                      <img src={rtmEligibleTeam?.logoUrl} className="w-10 h-10 object-contain" alt="RTM Logo" />
                    </div>
                    <div className="text-left">
                      <p className="text-indigo-300 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em] leading-none">Right To Match</p>
                      <h3 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter">{rtmEligibleTeam?.name}</h3>
                    </div>
                  </div>

                  <div className="w-full bg-black/40 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10">
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 md:mb-2">Requirement</p>
                    <p className="text-white text-2xl md:text-3xl font-black tabular-nums">Match ₹{room.auction.currentBid.toFixed(2)} Cr</p>
                    <p className="text-indigo-400 text-[8px] md:text-[10px] font-black uppercase mt-1 md:mt-2">
                      Cards Remaining: {room.teams[rtmEligibleTeamId!].rtmCards}
                    </p>
                  </div>

                  {isMyRtm ? (
                    <div className="flex flex-col w-full gap-2 md:gap-3">
                      <button 
                        onClick={() => finalizeSale(true)} 
                        className="w-full bg-white hover:bg-slate-100 text-indigo-900 font-black py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-xl md:text-2xl uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-100 ring-4 ring-white/20"
                      >
                        YES, EXERCISE RTM
                      </button>
                      <button 
                        onClick={() => finalizeSale(false)} 
                        className="text-indigo-300 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] py-3 transition-colors underline underline-offset-8"
                      >
                        NO, PASS TO HIGHEST BIDDER
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 md:gap-5 w-full">
                      <div className="w-full h-2 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-500/20">
                        <div 
                          className="h-full bg-indigo-400 transition-all duration-1000 ease-linear" 
                          style={{ width: `${(rtmTimer / 10) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-indigo-300 text-[9px] md:text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Waiting for {rtmEligibleTeam?.shortName} to decide...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
