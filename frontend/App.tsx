
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserSession, GameRoom } from './types';
import Home from './Home';
import Lobby from './Lobby';
import AuctionScreen from './AuctionScreen';

const AppRoutes: React.FC<{
  user: UserSession | null;
  room: GameRoom | null;
  setRoom: React.Dispatch<React.SetStateAction<GameRoom | null>>;
  onUpdateName: (name: string) => void;
  onJoinRoom: (roomData: GameRoom) => void;
  onLeaveRoom: () => void;
}> = ({ user, room, setRoom, onUpdateName, onJoinRoom, onLeaveRoom }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <Home
          onJoinRoom={(roomData) => {
            onJoinRoom(roomData);
            navigate(roomData.status === 'LIVE' ? `/auction/${roomData.id}` : `/warroom/${roomData.id}`);
          }}
          existingUser={user!}
          onUpdateName={onUpdateName}
        />
      } />
      <Route path="/warroom/:code" element={
        room ? (
          <Lobby
            room={room}
            userId={user!.id}
            userName={user!.name}
            onLeave={() => {
              onLeaveRoom();
              navigate('/');
            }}
            setRoom={setRoom}
          />
        ) : (
          <Home
            onJoinRoom={(roomData) => {
              onJoinRoom(roomData);
              navigate(roomData.status === 'LIVE' ? `/auction/${roomData.id}` : `/warroom/${roomData.id}`);
            }}
            existingUser={user!}
            onUpdateName={onUpdateName}
          />
        )
      } />
      <Route path="/auction/:code" element={
        room ? (
          <AuctionScreen
            room={room}
            userId={user!.id}
            onLeave={() => {
              onLeaveRoom();
              navigate('/');
            }}
            setRoom={setRoom}
          />
        ) : (
          <Home
            onJoinRoom={(roomData) => {
              onJoinRoom(roomData);
              navigate(roomData.status === 'LIVE' ? `/auction/${roomData.id}` : `/warroom/${roomData.id}`);
            }}
            existingUser={user!}
            onUpdateName={onUpdateName}
          />
        )
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const savedUser = sessionStorage.getItem('ipl_auction_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [room, setRoom] = useState<GameRoom | null>(() => {
    const savedRoom = sessionStorage.getItem('ipl_auction_room');
    return savedRoom ? JSON.parse(savedRoom) : null;
  });

  useEffect(() => {
    if (!user) {
      const newUser = { id: Math.random().toString(36).substring(2, 11), name: '', roomId: null };
      setUser(newUser);
      sessionStorage.setItem('ipl_auction_user', JSON.stringify(newUser));
    }
  }, [user]);

  useEffect(() => {
    if (room) {
      sessionStorage.setItem('ipl_auction_room', JSON.stringify(room));
    }
  }, [room]);

  const handleUpdateName = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      sessionStorage.setItem('ipl_auction_user', JSON.stringify(updatedUser));
    }
  };

  const handleJoinRoom = (roomData: GameRoom) => {
    setRoom(roomData);
    if (user) {
      setUser({ ...user, roomId: roomData.id });
    }
    sessionStorage.setItem('ipl_auction_room', JSON.stringify(roomData));
  };

  const handleLeaveRoom = () => {
    setRoom(null);
    if (user) {
      setUser({ ...user, roomId: null });
    }
    sessionStorage.removeItem('ipl_auction_room');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-black uppercase text-xs tracking-widest">
        Initializing Arena...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes
        user={user}
        room={room}
        setRoom={setRoom}
        onUpdateName={handleUpdateName}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
      />
    </BrowserRouter>
  );
};

export default App;
