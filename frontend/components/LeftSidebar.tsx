
import React from 'react';
import { GameRoom } from '../types';
import TrackPanel from './TrackPanel';
import SoldUnsoldPanel from './SoldUnsoldPanel';

interface LeftSidebarProps {
  room: GameRoom;
  activeTab: 'tracker' | 'soldunsold';
  setActiveTab: (tab: 'tracker' | 'soldunsold') => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ room, activeTab, setActiveTab }) => {
  return (
    <div className="hidden lg:flex w-80 border-r border-slate-800 flex-col bg-slate-950 overflow-hidden shrink-0">
      <div className="flex bg-slate-900 border-b border-slate-800 p-1 shrink-0 gap-1">
        <button 
          onClick={() => setActiveTab('tracker')} 
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === 'tracker' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500'}`}
        >
          Tracker
        </button>
        <button 
          onClick={() => setActiveTab('soldunsold')} 
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === 'soldunsold' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500'}`}
        >
          Sold/Unsold
        </button>
      </div>
      {activeTab === 'tracker' ? <TrackPanel room={room} /> : <SoldUnsoldPanel room={room} />}
    </div>
  );
};

export default LeftSidebar;
