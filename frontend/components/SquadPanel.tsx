
import React from 'react';
import { GameRoom } from '../types';
import { TEAMS } from '../constants';

interface SquadPanelProps {
  room: GameRoom;
  viewedTeamId: string;
  setViewedTeamId: (id: string) => void;
}

const SquadPanel: React.FC<SquadPanelProps> = ({ room, viewedTeamId, setViewedTeamId }) => {
  // Only show teams that are claimed by a player (player has teamId set to this team)
  const claimedTeamIds = new Set(
    Object.values(room.players)
      .map(p => p.teamId)
      .filter(Boolean) as string[]
  );
  const activeTeams = TEAMS.filter(t => claimedTeamIds.has(t.id));

  const team = room.teams[viewedTeamId];

  // Auto-select first active team if current selection is not claimed
  React.useEffect(() => {
    if (!claimedTeamIds.has(viewedTeamId) && activeTeams.length > 0) {
      setViewedTeamId(activeTeams[0].id);
    }
  }, [viewedTeamId, activeTeams, setViewedTeamId]);

  if (!team || activeTeams.length === 0) {
    return <div className="p-4 text-slate-500 text-xs font-black uppercase">No active teams yet</div>;
  }

  const grouped = {
    'BAT': team.squad.filter(p => p.role === 'BAT'),
    'BOWL': team.squad.filter(p => p.role === 'BOWL'),
    'AR': team.squad.filter(p => p.role === 'AR'),
    'WK': team.squad.filter(p => p.role === 'WK')
  };

  const retainedCount = team.squad.filter(p => p.isRetained).length;
  const boughtCount = team.squad.filter(p => !p.isRetained).length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-900 shrink-0">
        <select
          value={viewedTeamId}
          onChange={(e) => setViewedTeamId(e.target.value)}
          className="w-full bg-slate-800 text-white font-black text-[11px] px-3 py-2.5 rounded-lg border border-slate-700 outline-none uppercase"
        >
          {activeTeams.map(t => <option key={t.id} value={t.id}>{t.name} Squad</option>)}
        </select>
        <div className="flex items-center gap-4 mt-2 px-1">
          <span className="text-[9px] font-black text-slate-500 uppercase">
            Purse: <span className="text-green-400">₹{team.purse.toFixed(1)}Cr</span>
          </span>
          <span className="text-[9px] font-black text-slate-500 uppercase">
            Squad: <span className="text-white">{team.squad.length}/25</span>
          </span>
          {retainedCount > 0 && (
            <span className="text-[9px] font-black text-amber-500 uppercase">
              Retained: {retainedCount}
            </span>
          )}
          {boughtCount > 0 && (
            <span className="text-[9px] font-black text-blue-400 uppercase">
              Bought: {boughtCount}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar pb-10">
        {Object.entries(grouped).map(([cat, players]) => (
          <div key={cat} className="space-y-1">
            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-l-2 border-slate-700 pl-2 mb-2">{cat} ({players.length})</h4>
            {players.length === 0 ? <p className="text-[10px] text-slate-800 italic ml-2">Roster empty.</p> :
              players.map(p => (
                <div key={p.id} className={`p-3 rounded-xl border flex justify-between items-center group transition-colors
                  ${p.isRetained
                    ? 'bg-amber-950/30 border-amber-800/50 hover:bg-amber-900/40'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[11px] font-black text-white uppercase group-hover:text-yellow-400 truncate flex items-center gap-1.5">
                      {p.name}
                      {p.isOverseas && <span title="Overseas Player">✈️</span>}
                    </p>
                    <p className="text-[9px] font-bold uppercase flex items-center gap-2">
                      <span className="text-slate-500">{p.isOverseas ? 'Overseas' : 'India'}</span>
                      {p.isRetained ? (
                        <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">RETAINED</span>
                      ) : (
                        <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">BOUGHT</span>
                      )}
                    </p>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 ${p.isRetained ? 'text-amber-400' : 'text-green-400'}`}>
                    ₹{p.boughtPrice.toFixed(1)}Cr
                  </span>
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
