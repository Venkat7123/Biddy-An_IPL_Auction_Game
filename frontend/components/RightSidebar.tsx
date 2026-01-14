
import React from 'react';
import { GameRoom } from '../types';
import ChatPanel from './ChatPanel';
import SquadPanel from './SquadPanel';

interface RightSidebarProps {
  room: GameRoom;
  userId: string;
  setRoom: React.Dispatch<React.SetStateAction<GameRoom | null>>;
  activeTab: 'chat' | 'squads';
  setActiveTab: (tab: 'chat' | 'squads') => void;
  viewedTeamId: string;
  setViewedTeamId: (id: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  room,
  userId,
  setRoom,
  activeTab,
  setActiveTab,
  viewedTeamId,
  setViewedTeamId
}) => {
  return (
    <div className="hidden lg:flex w-80 border-l border-slate-800 flex-col shrink-0 bg-slate-950 overflow-hidden">
      <div className="flex bg-slate-900 border-b border-slate-800 p-1 shrink-0 gap-1">
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === 'chat' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500'}`}
        >
          Chat
        </button>
        <button 
          onClick={() => setActiveTab('squads')} 
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === 'squads' ? 'bg-slate-800 text-yellow-400' : 'text-slate-500'}`}
        >
          Squad
        </button>
      </div>
      {activeTab === 'chat' ? (
        <ChatPanel room={room} userId={userId} setRoom={setRoom} />
      ) : (
        <SquadPanel room={room} viewedTeamId={viewedTeamId} setViewedTeamId={setViewedTeamId} />
      )}
    </div>
  );
};

export default RightSidebar;
