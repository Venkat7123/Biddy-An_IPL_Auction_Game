
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
    <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/50 p-1 rounded-xl sm:rounded-2xl border border-slate-700 shadow-inner flex-shrink-0">
      <button
        onClick={skipPlayer}
        disabled={room.auction.status !== 'bidding'}
        className="bg-slate-900 hover:bg-slate-700 text-slate-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase transition-all disabled:opacity-30 whitespace-nowrap"
      >
        <span className="hidden sm:inline">Skip Player</span>
        <span className="sm:hidden">Skip</span>
      </button>
      <button
        onClick={skipSet}
        className="bg-slate-900 hover:bg-red-900 text-slate-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase transition-all whitespace-nowrap"
      >
        <span className="hidden sm:inline">Skip Set</span>
        <span className="sm:hidden">Set</span>
      </button>
      <div className="w-px h-5 sm:h-6 bg-slate-700"></div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <span className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase hidden sm:inline">Time:</span>
        {[15, 10, 5].map(v => (
          <button
            key={v}
            onClick={() => changeTimerLimit(v)}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-black transition-all border ${room.auction.bidTimeLimit === v ? 'bg-yellow-400 text-slate-950 border-yellow-400' : 'bg-slate-950 text-slate-600 border-slate-900'}`}
          >
            {v}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default HostControls;
