
import React, { useState, useEffect, useRef } from 'react';
import { GameRoom, ChatMessage } from '../types';
import socket from "../services/socketClient";

interface ChatProps {
  room: GameRoom;
  userId: string;
  setRoom: React.Dispatch<React.SetStateAction<GameRoom | null>>;
}

const ChatPanel: React.FC<ChatProps> = ({ room, userId, setRoom }) => {
  const [msg, setMsg] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  const handleChatUpdate = (message: ChatMessage) => {
    setRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        chat: [...prev.chat, message],
      };
    });
  };

  socket.on("chat_update", handleChatUpdate);

  return () => {
    socket.off("chat_update", handleChatUpdate);
  };
}, [setRoom]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [room.chat]);

  const sendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (!msg.trim()) return;

  socket.emit("send_message", {
    roomId: room.id,
    user: {
      id: userId,
      name: room.players[userId].name
    },
    text: msg
  });

  setMsg('');
};


  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mega Auction Feed</h3>
        <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Live</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-24 lg:pb-4">
        {room.chat.map((c) => (
          <div key={c.id} className={`animate-in slide-in-from-bottom-1 duration-200 ${c.type === 'system' ? 'bg-slate-900/80 p-3 rounded-2xl border border-slate-800/50 my-1' : ''}`}>
            <div className="flex items-start gap-2">
              {c.type === 'user' ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-400 px-1.5 py-0.5 rounded shrink-0">
                    {c.senderName}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 leading-snug">
                    {c.text}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400/10 text-yellow-500 px-1.5 py-0.5 rounded shrink-0">
                    Log
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 leading-snug">
                    {c.text}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 pb-24 lg:pb-4 shrink-0">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all font-bold placeholder:text-slate-700"
            placeholder="Broadcast a message..."
          />
          <button type="submit" className="bg-yellow-400 p-3 rounded-xl text-slate-900 shadow-lg shadow-yellow-400/10 active:scale-90 transition-transform">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
