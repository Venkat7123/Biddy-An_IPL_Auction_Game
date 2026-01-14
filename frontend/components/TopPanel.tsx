
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
}

const TopPanel: React.FC<TopPanelProps> = ({ 
  room, 
  isHost, 
  onLeave, 
  skipPlayer, 
  skipSet, 
  changeTimerLimit
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-[60] shadow-xl shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm sm:text-lg font-black text-white uppercase leading-none tracking-tight">{room.name}</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase mt-1">Room Code: {room.id}</p>
        </div>
      </div>

      {isHost && (
        <HostControls 
          room={room} 
          skipPlayer={skipPlayer} 
          skipSet={skipSet} 
          changeTimerLimit={changeTimerLimit} 
        />
      )}

      <div className="flex items-center gap-3">
        <button 
          onClick={() => { if (confirm("Are you sure you want to exit?")) onLeave(); }} 
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border border-red-500/30"
        >
          Exit Arena
        </button>
      </div>
    </div>
  );
};

export default TopPanel;
