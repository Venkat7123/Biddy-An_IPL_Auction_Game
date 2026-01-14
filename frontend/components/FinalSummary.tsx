
import React from 'react';
import { GameRoom } from '../types';
import { TEAMS } from '../constants';

interface FinalSummaryProps {
  room: GameRoom;
  onExit: () => void;
}

const FinalSummary: React.FC<FinalSummaryProps> = ({ room, onExit }) => {
  // Map team IDs to owner names from the players list
  const teamOwners: Record<string, string> = {};
  Object.entries(room.players).forEach(([_, playerData]) => {
    if (playerData.teamId) {
      teamOwners[playerData.teamId] = playerData.name;
    }
  });

  // Filter only teams that have an owner assigned
  const securedTeams = TEAMS.filter(t => !!teamOwners[t.id]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[1000] overflow-y-auto custom-scrollbar p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-3 drop-shadow-2xl">
              Auction <span className="text-yellow-400">Concluded</span>
            </h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs md:text-sm flex items-center gap-3 justify-center md:justify-start">
              <span className="w-12 h-px bg-slate-800"></span>
              Mega IPL Auction 2025 • The Class of 2025
              <span className="w-12 h-px bg-slate-800"></span>
            </p>
          </div>
          <button 
            onClick={onExit}
            className="group relative bg-red-600 hover:bg-red-500 text-white font-black px-12 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Exit Arena
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </button>
        </header>

        {securedTeams.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
            <p className="text-slate-500 font-black uppercase tracking-widest">No franchises were claimed this session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            {securedTeams.map(team => {
              const state = room.teams[team.id];
              const ownerName = teamOwners[team.id];
              const overseasCount = state.squad.filter(p => p.isOverseas).length;

              return (
                <div key={team.id} className="group bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[3rem] p-8 flex flex-col hover:border-slate-700 transition-all hover:shadow-[0_0_40px_rgba(30,41,59,0.5)]">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-1">
                         <img src={team.logoUrl} alt={team.shortName} className="w-10 h-10 object-contain drop-shadow-lg" />
                         <h3 className="text-2xl font-black text-white uppercase tracking-tight truncate">{team.shortName}</h3>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{team.name}</p>
                        <p className="text-[10px] font-black text-yellow-500 uppercase flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                          Manager: {ownerName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-green-400 font-black text-2xl tracking-tighter">₹{state.purse.toFixed(1)}<span className="text-sm ml-0.5">Cr</span></p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase">Purse Left</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Squad Size</p>
                      <p className="text-white font-black text-xl">{state.squad.length}<span className="text-slate-700 text-sm ml-1">/25</span></p>
                    </div>
                    <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Overseas</p>
                      <p className={`font-black text-xl ${overseasCount >= 8 ? 'text-red-500' : 'text-blue-400'}`}>
                        <span className="mr-1">✈️</span>{overseasCount}<span className="text-slate-700 text-sm ml-1">/8</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <div className="flex justify-between items-center px-1 mb-4 border-b border-slate-800 pb-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Player Name</span>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Price</span>
                    </div>
                    {state.squad.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-slate-700 font-black uppercase text-xs">No signings made</p>
                      </div>
                    ) : (
                      state.squad.map(p => (
                        <div 
                          key={p.id} 
                          className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all ${
                            p.isRetained 
                            ? 'bg-indigo-600/5 border-indigo-500/20 hover:bg-indigo-600/10' 
                            : 'bg-blue-600/5 border-blue-500/20 hover:bg-blue-600/10'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${p.isRetained ? 'bg-indigo-500' : 'bg-blue-400'}`}></span>
                              <p className="text-xs font-black text-white uppercase truncate">{p.name}</p>
                              {p.isOverseas && <span className="text-[9px] flex items-center gap-0.5 ml-1" title="Overseas Player">✈️</span>}
                            </div>
                            <p className={`text-[8px] font-bold uppercase tracking-widest ${p.isRetained ? 'text-indigo-400' : 'text-blue-400'}`}>
                              {p.role} • {p.isRetained ? 'Retained' : 'Bought'}
                            </p>
                          </div>
                          <span className={`text-[11px] font-black tabular-nums ${p.isRetained ? 'text-indigo-300' : 'text-blue-300'}`}>
                            ₹{p.boughtPrice.toFixed(1)}Cr
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalSummary;
