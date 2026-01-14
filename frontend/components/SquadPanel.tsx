
import React from 'react';
import { GameRoom } from '../types';
import { TEAMS } from '../constants';

interface SquadPanelProps {
  room: GameRoom;
  viewedTeamId: string;
  setViewedTeamId: (id: string) => void;
}

const SquadPanel: React.FC<SquadPanelProps> = ({ room, viewedTeamId, setViewedTeamId }) => {
  const team = room.teams[viewedTeamId];
  if (!team) return <div className="p-4 text-slate-500 text-xs font-black uppercase">Select a team</div>;

  const grouped = {
    'BAT': team.squad.filter(p => p.role === 'BAT'),
    'BOWL': team.squad.filter(p => p.role === 'BOWL'),
    'AR': team.squad.filter(p => p.role === 'AR'),
    'WK': team.squad.filter(p => p.role === 'WK')
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-900 shrink-0">
        <select 
          value={viewedTeamId} 
          onChange={(e) => setViewedTeamId(e.target.value)} 
          className="w-full bg-slate-800 text-white font-black text-[11px] px-3 py-2.5 rounded-lg border border-slate-700 outline-none uppercase"
        >
          {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name} Squad</option>)}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar pb-10">
        {Object.entries(grouped).map(([cat, players]) => (
          <div key={cat} className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-l-2 border-slate-700 pl-2 mb-2">{cat} ({players.length})</h4>
            {players.length === 0 ? <p className="text-[10px] text-slate-800 italic ml-2">Roster empty.</p> :
              players.map(p => (
                <div key={p.id} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[11px] font-black text-white uppercase group-hover:text-yellow-400 truncate flex items-center gap-1.5">
                      {p.name}
                      {p.isOverseas && <span title="Overseas Player">✈️</span>}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">
                      {p.isOverseas ? 'Overseas' : 'India'} {p.isRetained ? '(RETAINED)' : ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-black text-green-400 shrink-0">₹{p.boughtPrice.toFixed(1)}Cr</span>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default SquadPanel;
