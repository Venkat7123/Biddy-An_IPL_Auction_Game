
import React from 'react';
import { GameRoom } from '../types';
import { PLAYERS, mapSlab } from '../constants';

interface TrackPanelProps {
  room: GameRoom;
}

const TrackPanel: React.FC<TrackPanelProps> = ({ room }) => {
  const currentSet = PLAYERS.filter(p => 
    p.setNo === room.auction.currentSetNo && 
    room.playersPool[p.id].status !== 'SOLD' && 
    room.playersPool[p.id].status !== 'UNSOLD'
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
      <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">SET TRACKER</span>
        <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[9px] font-black uppercase">
          SET {room.auction.currentSetNo || '-'} - {room.auction.currentSetNo ? mapSlab(room.auction.currentSetNo) : '-'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar pb-10">
        <section>
          <h4 className="text-[9px] font-black text-yellow-400/50 uppercase mb-3 border-l-2 border-yellow-400 pl-2">Current Set Lots</h4>
          {currentSet.map(p => {
            const status = room.playersPool[p.id].status;
            const isLive = p.id === room.auction.currentPlayerId;
            return (
              <div 
                key={p.id} 
                className={`p-3 rounded-xl border mb-2 transition-all ${isLive ? 'bg-yellow-400/10 border-yellow-400 ring-1 ring-yellow-400/20' : 'bg-slate-900 border-slate-800 opacity-60'}`}
              >
                <p className={`text-[11px] font-black uppercase ${isLive ? 'text-yellow-400' : 'text-white'}`}>{p.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">{p.role} • {status}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default TrackPanel;
