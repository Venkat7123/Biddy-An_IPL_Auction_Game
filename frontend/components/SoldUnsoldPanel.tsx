
import React from 'react';
import { GameRoom } from '../types';
import { PLAYERS, TEAMS } from '../constants';

interface SoldUnsoldPanelProps {
  room: GameRoom;
}

const SoldUnsoldPanel: React.FC<SoldUnsoldPanelProps> = ({ room }) => {
  const soldPlayers = Object.entries(room.playersPool)
    .filter(([_, item]: any) => item.status === 'SOLD')
    .map(([id, item]: any) => {
      const player = PLAYERS.find(p => p.id === id)!;
      return {
        ...player,
        soldToTeamId: item.winningTeamId,
        soldPrice: item.finalPrice
      };
    });

  const unsoldPlayers = Object.entries(room.playersPool)
    .filter(([_, item]: any) => item.status === 'UNSOLD')
    .map(([id]) => PLAYERS.find(p => p.id === id)!);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div>
          <h4 className="text-[9px] font-black text-green-400 uppercase mb-3">Sold Players</h4>
          {soldPlayers.length === 0 ? (
            <p className="text-[10px] text-slate-600">None yet</p>
          ) : (
            soldPlayers.map(p => (
              <div key={p.id} className="p-3 rounded-xl border mb-2 transition-all bg-slate-900 border-slate-800 opacity-60">
                <p className="text-[11px] font-black uppercase text-white flex justify-between">
                 <span>{p.name}</span>
                 <span className="text-[10px] font-bold text-blue-400">
                  {TEAMS.find(t => t.id === p.soldToTeamId)?.shortName}
                 </span>
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase flex justify-between">
                  <span>{p.role} • SOLD </span>
                  <span className="text-[10px] font-bold text-green-400">₹{p.soldPrice?.toFixed(2)} Cr</span>
                </p>
              </div>
            ))
          )}
        </div>

        <div>
          <h4 className="text-[9px] font-black text-red-400 uppercase mb-3">Unsold Players</h4>
          {unsoldPlayers.length === 0 ? (
            <p className="text-[10px] text-slate-600">None</p>
          ) : (
            unsoldPlayers.map(p => (
              <div key={p.id} className="p-3 rounded-xl border mb-2 transition-all bg-slate-900 border-slate-800 opacity-60">
                <p className="text-[11px] font-black uppercase text-white">{p.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{p.role} • UNSOLD</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SoldUnsoldPanel;
