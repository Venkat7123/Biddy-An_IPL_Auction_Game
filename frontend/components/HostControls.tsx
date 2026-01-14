
import React from 'react';
import { GameRoom } from '../types';

interface HostControlsProps {
  room: GameRoom;
  skipPlayer: () => void;
  skipSet: () => void;
  changeTimerLimit: (val: number) => void;
}

const HostControls: React.FC<HostControlsProps> = ({ 
  room, 
  skipPlayer, 
  skipSet, 
  changeTimerLimit
}) => {
  return (
    <div className="hidden md:flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-2xl border border-slate-700 shadow-inner">
        <button 
          onClick={skipPlayer} 
          disabled={room.auction.status !== 'bidding'} 
          className="bg-slate-900 hover:bg-slate-700 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-30"
        >
          Skip Player
        </button>
        <button 
          onClick={skipSet} 
          className="bg-slate-900 hover:bg-red-900 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
        >
          Skip Set
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-black text-slate-600 uppercase ml-1 mr-1">Time:</span>
          {[15, 10, 5].map(v => (
            <button 
              key={v} 
              onClick={() => changeTimerLimit(v)} 
              className={`w-9 h-9 rounded-lg text-[10px] font-black transition-all border ${room.auction.bidTimeLimit === v ? 'bg-yellow-400 text-slate-950 border-yellow-400' : 'bg-slate-950 text-slate-600 border-slate-900'}`}
            >
              {v}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostControls;
