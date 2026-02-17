
import React from 'react';
import { GameRoom } from '../types';
import { TEAMS } from '../constants';

interface SummaryBarProps {
  room: GameRoom;
}

const SummaryBar: React.FC<SummaryBarProps> = ({ room }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-3 shadow-lg z-50 shrink-0">
      {TEAMS.filter(t => {
        const isPresent = Object.values(room.players).some((p: any) => p.teamId === t.id && !p.isSpectator);
        return isPresent;
      }).map(t => {
        const state = room.teams[t.id];
        const osCount = state.squad.filter(p => p.isOverseas).length;
        return (
          <div key={t.id} className="bg-slate-800 px-4 py-2 rounded-xl border border-indigo-500/50 min-w-[150px]">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <img src={t.logoUrl} alt={t.shortName} className="w-4 h-4 object-contain" />
                <span className="text-[10px] font-black text-white uppercase">{t.shortName}</span>
              </div>
              <span className="text-xs font-black text-green-400">₹{state.purse.toFixed(1)}Cr</span>
            </div>
            <div className="flex gap-2 text-[9px] font-bold text-slate-500 uppercase">
              <span>S: {state.squad.length}/25</span>
              <span className={`${osCount >= 8 ? 'text-red-500' : 'text-blue-400'} flex items-center gap-0.5`}>
                ✈️ {osCount}/8
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryBar;
