import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserSession, GameRoom } from './types';
import { createRoom, getRoomSummary, getPublicRooms } from './services/apiClient';
import socket from './services/socketClient';

interface HomeProps {
  onJoinRoom?: (room: GameRoom) => void;
  existingUser: UserSession;
  onUpdateName: (name: string) => void;
}

const Home: React.FC<HomeProps> = ({ onJoinRoom, existingUser, onUpdateName }) => {
  const location = useLocation();
  const [roomCode, setRoomCode] = useState('');
  const [publicRoomsList, setPublicRoomsList] = useState<{ id: string; name: string; hostName: string; playersCount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill room code from URL if landing on /warroom/:code
  useEffect(() => {
    const match = location.pathname.match(/\/warroom\/([A-Za-z0-9]+)/);
    if (match && match[1]) {
      setRoomCode(match[1].toUpperCase());
    }
  }, [location.pathname]);

  const isNameValid = existingUser.name.trim().length > 0;



  useEffect(() => {
    loadPublicRooms();

    const handleNewRoom = (roomSummary: { id: string; name: string; hostName: string; playersCount: number }) => {
      setPublicRoomsList(prev => [roomSummary, ...prev]);
    };

    const handleRoomRemoved = ({ roomId }: { roomId: string }) => {
      setPublicRoomsList(prev => prev.filter(r => r.id !== roomId));
    };

    socket.on("public_room_added", handleNewRoom);
    socket.on("public_room_removed", handleRoomRemoved);

    return () => {
      socket.off("public_room_added", handleNewRoom);
      socket.off("public_room_removed", handleRoomRemoved);
    };
  }, []);

  const loadPublicRooms = async () => {
    try {
      const rooms = await getPublicRooms();
      setPublicRoomsList(rooms);
    } catch (error) {
      console.error("Failed to load public rooms", error);
    }
  };

  const handleCreateRoom = async (isPublic: boolean) => {
    setIsLoading(true);
    try {
      const response = await createRoom(existingUser.name, isPublic, existingUser.id);
      // The endpoint returns { roomId, userId, room }
      // We need to match what onJoinRoom expects (GameRoom)
      // Check room.routes.ts response structure: res.json({ roomId, userId, room: newRoom });
      // The client request generic is <{ roomId: string }> in the current file but we updated it implicitly
      // Let's cast or update apiClient if needed, but for now assuming response works.
      // Actually apiClient request<{ roomId: string }> might be too narrow if we don't change it.
      // But `response` will contain the full JSON.
      // Let's assume response any for now or trust it returns the object.
      // Wait, apiClient createRoom signature is `return request<{ roomId: string }>...`
      // I should probably update apiClient to return more or just cast here.
      // The route returns `room`.

      // Let's update apiClient in a separate step or just cast here.
      // Using "as any" for quick fix, but cleaner to update types.
      const data = response as any;

      onJoinRoom?.(data.room);
    } catch (error) {
      console.error("Failed to create room", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const joinByCode = async () => {
    if (!roomCode || !isNameValid) return;
    setIsLoading(true);
    try {
      // Fetch room summary/state
      // backend/src/routes/room.routes.ts: router.get("/:roomId/summary") returns the room (GameRoom)
      const room = await getRoomSummary(roomCode.toUpperCase()) as unknown as GameRoom;
      onJoinRoom?.(room);
    } catch (error) {
      console.error("Failed to join room", error);
      alert("Room not found or error joining.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen auction-gradient flex flex-col items-center justify-start p-6 pt-12 md:pt-20 pb-16">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter">IPL MEGA AUCTION</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">2025 Real-Time Engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 flex flex-col justify-center">
                <p className="text-[10px] font-black pb-2 text-slate-500 uppercase tracking-widest mb-1">Manager Identity</p>
                <div className="flex justify-between bg-slate-950 p-2 rounded-lg gap-2">
                  <input
                    type="text"
                    value={existingUser.name}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="bg-transparent text-l font-black text-white outline-none border-b-2 border-transparent transition-all w-full"
                    placeholder="Enter your Name..."
                  />
                  <span className="text-2xl shrink-0">🔥</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleCreateRoom(true)}
                  disabled={!isNameValid || isLoading}
                  className={`bg-blue-600 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest
    ${(!isNameValid || isLoading) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-500 active:scale-95'}`}
                >
                  {isLoading ? 'Creating...' : 'Create Public Auction'}
                </button>
                <button
                  onClick={() => handleCreateRoom(false)}
                  disabled={!isNameValid || isLoading}
                  className={`bg-purple-600 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest
    ${(!isNameValid || isLoading) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-500 active:scale-95'}`}
                >
                  {isLoading ? 'Creating...' : 'Create Private Auction'}
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700"></span></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="px-2 bg-slate-800 text-slate-500">Search Live Arena</span></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-black uppercase tracking-widest focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  placeholder="ENTER ROOM CODE"
                />
                <button onClick={joinByCode} disabled={isLoading || !isNameValid} className={`bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs active:scale-95 ${(!isNameValid || isLoading) ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  {isLoading ? '...' : 'Join'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col h-[400px]">
              <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active Public Arenas
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {publicRoomsList.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-600 text-[10px] uppercase font-black italic">No public arenas live yet.</p>
                  </div>
                ) : (
                  publicRoomsList.map(room => {
                    return (
                      <div key={room.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-slate-500 transition-all">
                        <div className="min-w-0 pr-2">
                          <p className="text-white font-black text-sm truncate uppercase">{room.name}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Host: {room.hostName}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!isNameValid) {
                              alert("Please enter your name first!");
                              return;
                            }
                            setRoomCode(room.id);
                            getRoomSummary(room.id).then((r: any) => onJoinRoom?.(r));
                          }}
                          disabled={!isNameValid}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase active:scale-95 ${!isNameValid ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-slate-900'}`}
                        >
                          Join
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 text-center z-50">
        <p className="text-[10px] text-slate-500 font-bold">Made with ❤️ by Venkat</p>
      </div>
    </div>
  );
};

export default Home;
