
import React from 'react';
import { GameRoom } from '../types';
import HostControls from './HostControls';

interface TopPanelProps {
  room: GameRoom;
  isHost: boolean;
  onLeave: () => void;
  skipPlayer: () => void;
  skipSet: () => void;
  changeTimerLimit: (val: number) => void;
  myTeam?: { name: string; logoUrl: string; color: string };
}

const TopPanel: React.FC<TopPanelProps> = ({
  room,
  isHost,
  onLeave,
  skipPlayer,
  skipSet,
  changeTimerLimit,
  myTeam
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 sm:p-4 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-[60] shadow-xl shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xs sm:text-lg font-black text-white uppercase leading-none tracking-tight truncate">{room.name}</h1>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase mt-0.5 sm:mt-1">Code: {room.id}</p>
        </div>
        {myTeam && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/50 px-2 sm:px-3 py-1 rounded-lg border border-slate-700 flex-shrink-0" style={{ borderLeftColor: myTeam.color, borderLeftWidth: '4px' }}>
            <img src={myTeam.logoUrl} alt="My Team" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            <span className="text-[10px] sm:text-xs font-black text-white uppercase hidden sm:block">{myTeam.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isHost && (
          <HostControls
            room={room}
            skipPlayer={skipPlayer}
            skipSet={skipSet}
            changeTimerLimit={changeTimerLimit}
          />
        )}
        <button
          onClick={() => { if (confirm("Are you sure you want to exit?")) onLeave(); }}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all border border-red-500/30 whitespace-nowrap"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default TopPanel;
