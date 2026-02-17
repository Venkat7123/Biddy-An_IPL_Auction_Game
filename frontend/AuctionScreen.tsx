import React, { useState, useEffect, useRef } from 'react';
import { GameRoom, Player } from './types';
import { PLAYERS, TEAMS, MAX_OVERSEAS, MAX_SQUAD } from './constants';
import { audioService, getAuctioneerCommentary } from './services/service';
import Layout from './components/Layout';
import TopPanel from './components/TopPanel';
import SummaryBar from './components/SummaryBar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MainPanel from './components/MainPanel';
import ChatPanel from './components/ChatPanel';
import TrackPanel from './components/TrackPanel';
import SoldUnsoldPanel from './components/SoldUnsoldPanel';
import SquadPanel from './components/SquadPanel';
import FinalSummary from './components/FinalSummary';
import socket from "./services/socketClient";

interface AuctionScreenProps {
  room: GameRoom;
  userId: string;
  onLeave: () => void;
  setRoom: React.Dispatch<React.SetStateAction<GameRoom | null>>;
}

const AuctionScreen: React.FC<AuctionScreenProps> = ({ room, userId, onLeave, setRoom }) => {
  const [timer, setTimer] = useState(room.auction.bidTimeLimit);
  const [rtmTimer, setRtmTimer] = useState(10);
  const [isBidding, setIsBidding] = useState(false);
  const [viewedTeamId, setViewedTeamId] = useState<string>(room.players[userId]?.teamId || 'csk');
  const [mobileTab, setMobileTab] = useState<'auction' | 'tracker' | 'soldunsold' | 'squads' | 'chat'>('auction');
  const [leftSidebarTab, setLeftSidebarTab] = useState<'tracker' | 'soldunsold'>('tracker');
  const [rightSidebarTab, setRightSidebarTab] = useState<'chat' | 'squads'>('chat');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' | 'error', duration = 5000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, duration);
  };

  // Keep a stable ref so useEffect closures always call the latest showToast
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync room state from props/backend
  // When room updates, we might need to sync timer if backend manages it?
  // Currently backend doesn't broadcast timer ticks, so we keep local timer for display,
  // but logic relies on checking room state.
  // Actually, for a robust app, backend should control timer or we just sync on events.
  // We'll trust frontend timer for visual for now, but backend events drive state.

  const currentPlayer = room.auction.currentPlayerId
    ? PLAYERS.find(p => p.id === room.auction.currentPlayerId)
    : null;

  const myTeamId = room.players[userId]?.teamId;
  const myTeamState = myTeamId ? room.teams[myTeamId] : null;
  const isHost = room.hostId === userId;
  const isSpectator = room.players[userId]?.isSpectator || !myTeamId;

  // Listen for Room Updates (Source of Truth)
  useEffect(() => {
    const handleRoomUpdate = (updatedRoom: GameRoom) => {
      setRoom(updatedRoom);

      // Reset timer if player changed or bid happened
      // This is a heuristic. Ideally backend tells us "reset timer".
      // But comparing with previous room state is tricky inside this callback without ref.
      // We'll rely on specific events for audio/effects, but room_update for data.
    };

    socket.on("room_update", handleRoomUpdate);

    // Specific events for FX
    socket.on("bid_rejected", ({ reason }) => {
      showToastRef.current(reason, "info", 5000);
    });

    socket.on("notification", (data: { message: string, type: 'success' | 'info' | 'error', duration?: number }) => {
      const duration = data.duration || 5000;
      showToastRef.current(data.message, data.type, duration);
    });

    // Ensure socket is in the room channel
    socket.emit("join_room", { roomId: room.id, userId });

    return () => {
      socket.off("room_update", handleRoomUpdate);
      socket.off("bid_rejected");
      socket.off("notification");
    };
  }, [room.id, userId, setRoom]);

  // Show toast from room.lastNotification (guaranteed delivery via room_update)
  const lastSeenNotifRef = useRef<string | null>(null);
  useEffect(() => {
    if (room.lastNotification && room.lastNotification.id !== lastSeenNotifRef.current) {
      lastSeenNotifRef.current = room.lastNotification.id;
      showToast(room.lastNotification.message, room.lastNotification.type, room.lastNotification.duration);
    }
  }, [room.lastNotification]);

  // Handle Audio & Animation Triggers based on room state changes
  useEffect(() => {
    // If bid increased
    // We need to track previous bid to know if it increased.
    // For now, let's just say if auction status is 'bidding' and we get an update, maybe play sound?
    // Too noisy. Let's rely on specific events if we had them, OR just `room_update`.
    // The original code had `socket.on("auction_update")`.
    // We removed that from backend, now everything is `room_update`.
    // We can check if `room.auction.currentBid` changed.
  }, [room.auction.currentBid]);

  // HOST: Auto-start next player if idle
  useEffect(() => {
    // Auto-advance for SOLD/UNSOLD
    if (isHost && room.status === 'LIVE' && (room.auction.status === 'sold' || room.auction.status === 'unsold')) {
      const timeout = setTimeout(() => startNextPlayer(), 3000); // 3 seconds delay
      return () => clearTimeout(timeout);
    }

    if (isHost && room.status === 'LIVE' && room.auction.status === 'idle') {
      const timeout = setTimeout(() => startNextPlayer(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [room.status, room.auction.status, isHost]);

  // Timer Logic
  // Timer Logic using auctionEndTime
  useEffect(() => {
    if (room.auction.status === 'bidding' && room.auction.auctionEndTime) {
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.ceil((room.auction.auctionEndTime! - now) / 1000);
        setTimer(Math.max(0, diff));
      };

      // Update immediately
      updateTimer();

      // Interval to update display
      timerRef.current = setInterval(updateTimer, 100); // 10Hz for smooth updates
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (room.auction.status === 'idle') {
        setTimer(room.auction.bidTimeLimit);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [room.auction.status, room.auction.auctionEndTime]);

  // RTM Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (room.auction.status === 'rtm_pending') {
      setRtmTimer(10); // Reset to 10 when entering state
      interval = setInterval(() => {
        setRtmTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // RTM timer expired — auto-decline (pass to highest bidder)
            if (isHost) {
              socket.emit("rtm_decision", {
                roomId: room.id,
                userId,
                decision: 'NO'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setRtmTimer(10);
    }
    return () => clearInterval(interval);
  }, [room.auction.status]);

  // Handle Bid Sound locally when bid changes
  const prevBidRef = useRef(room.auction.currentBid);
  useEffect(() => {
    if (room.auction.currentBid > prevBidRef.current) {
      audioService.playBid();
      setIsBidding(true);
      setTimeout(() => setIsBidding(false), 200);
      setTimer(room.auction.bidTimeLimit); // Reset visual timer
    }
    prevBidRef.current = room.auction.currentBid;
  }, [room.auction.currentBid]);

  // Auto-end auction if timer hits 0 (HOST ONLY triggers it)
  useEffect(() => {
    if (isHost && timer === 0 && room.auction.status === 'bidding') {
      // Safety check: Ensure the server time actually says it's over
      // This prevents race conditions where timer=0 from previous state triggers premature end
      if (room.auction.auctionEndTime && Date.now() >= room.auction.auctionEndTime) {
        handleAuctionEnd();
      }
    }
  }, [timer, isHost, room.auction.status, room.auction.auctionEndTime]);


  const startNextPlayer = () => {
    if (!isHost) return;

    // Find next player
    const pendingPlayers = PLAYERS.filter(p => room.playersPool[p.id]?.status === 'PENDING'); // Check pool status safely
    if (pendingPlayers.length === 0) {
      // All players have been auctioned — end the game
      socket.emit("host_action", {
        roomId: room.id,
        userId,
        action: "END_AUCTION"
      });
      return;
    }

    // 2. Find the lowest set number that has at least one pending player
    const availableSetNumbers = Array.from(new Set(pendingPlayers.map(p => p.setNo))).sort((a, b) => a - b);
    const activeSetNo = availableSetNumbers[0];

    // 3. Filter only the players within that specific set
    const setCandidates = pendingPlayers.filter(p => p.setNo === activeSetNo);

    // 4. Select a random player from that specific set
    const nextPlayer = setCandidates[Math.floor(Math.random() * setCandidates.length)];

    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: "START_PLAYER",
      payload: {
        playerId: nextPlayer.id,
        setNo: activeSetNo,
        basePrice: nextPlayer.basePrice,
        player: nextPlayer // Send full player just in case
      }
    });
  };

  const handleAuctionEnd = async () => {
    // If no bidder, UNSOLD. If bidder, SOLD/RTM.
    if (!room.auction.highestBidderId) {
      // Unsold
      audioService.playUnsold();
      socket.emit("host_action", {
        roomId: room.id,
        userId,
        action: "UNSOLD"
      });

      // AI Commentary for Unsold - send to chat?
      // We can do this on frontend or backend. Keeping frontend for now.
      // But chat needs to be synced. The backend `GameRoom` has `chat`.
      // We don't have a `send_message` socket event yet.
      // Let's rely on backend system messages if possible, or skip for now.
    } else {
      // Sold
      // Check RTM (Simplified: Auto-sell for now, implement RTM later)
      finalizeSale(false);
    }
  };

  const finalizeSale = async (rtmUsed: boolean) => {
    audioService.playHammer();
    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: "SOLD"
    });
  };

  const placeBid = () => {
    if (isSpectator || !myTeamState || !currentPlayer || room.auction.status !== 'bidding') return;

    // Calculate next bid
    // If no current bidder, next bid is the current base price (currentBid).
    // If there is a bidder, next bid is currentBid + increment.
    let nextBid: number;
    const increment = room.auction.bidIncrement || 0.2; // default

    if (room.auction.highestBidderId === null) {
      // First bid matches the base price
      nextBid = room.auction.currentBid;
    } else {
      // Increment
      nextBid = room.auction.currentBid + increment;
    }

    // Fix floating point precision issues (e.g. 2.2 + 0.2 = 2.4000000000000004)
    nextBid = Math.round(nextBid * 100) / 100;

    // Local checks
    if (myTeamState.purse < nextBid) {
      showToast('Insufficient Budget.', 'info', 5000);
      return;
    }
    if (myTeamState.squad.length >= MAX_SQUAD) {
      showToast('Squad capacity reached (MAX 25).', 'info', 5000);
      return;
    }
    const osCount = myTeamState.squad.filter(p => p.isOverseas).length;
    if (currentPlayer.isOverseas && osCount >= MAX_OVERSEAS) {
      showToast('Overseas limit reached (MAX 8).', 'info', 5000);
      return;
    }

    socket.emit("place_bid", {
      roomId: room.id,
      userId,
      amount: nextBid,
    });

    // Optimistic Timer Reset for smoother UI
    setTimer(room.auction.bidTimeLimit);
  };

  const skipPlayer = () => {
    if (!isHost || !currentPlayer) return;
    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: "UNSOLD"
    });
    showToast(`${currentPlayer.name} marked as unsold.`, 'info', 5000);
  };

  const skipSet = () => {
    if (!isHost) return;
    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: "SKIP_SET"
    });
    showToast('Skipping to next set...', 'info', 5000);
  };

  const changeTimerLimit = (val: number) => {
    if (!isHost) return;
    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: "CHANGE_TIMER",
      payload: { limit: val }
    });
    showToast(`Timer set to ${val}s`, 'success', 5000);
  };

  if (room.status === 'finished') {
    return <FinalSummary room={room} onExit={() => {
      // Full cleanup: clear room state and go home
      setRoom(null);
      localStorage.removeItem('ipl_auction_room');
    }} />;
  }

  return (
    <Layout
      mobileTab={mobileTab}
      setMobileTab={setMobileTab}
      header={
        <TopPanel
          room={room}
          isHost={isHost}
          onLeave={onLeave}
          skipPlayer={skipPlayer}
          skipSet={skipSet}
          changeTimerLimit={changeTimerLimit}
          myTeam={myTeamState ? {
            name: myTeamState.name,
            logoUrl: myTeamState.logoUrl || '',
            color: myTeamState.color || '#fff'
          } : undefined}
        />
      }
      summaryBar={<SummaryBar room={room} />}
      toast={toast && (
        <div className={`fixed top-32 left-1/2 -translate-x-1/2 z-[100] px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'} font-black text-xs uppercase tracking-widest`}>
          {toast.msg}
        </div>
      )}
      leftSidebar={
        <LeftSidebar
          room={room}
          activeTab={leftSidebarTab}
          setActiveTab={setLeftSidebarTab}
        />
      }
      rightSidebar={
        <RightSidebar
          room={room}
          userId={userId}
          setRoom={setRoom}
          activeTab={rightSidebarTab}
          setActiveTab={setRightSidebarTab}
          viewedTeamId={viewedTeamId}
          setViewedTeamId={setViewedTeamId}
        />
      }
      mainPanel={
        <>
          <div className={`h-full ${mobileTab === 'auction' ? 'block' : 'hidden lg:block'}`}>
            <MainPanel
              room={room}
              userId={userId}
              isHost={isHost}
              isSpectator={isSpectator}
              isBidding={isBidding}
              timer={timer}
              rtmTimer={rtmTimer}
              currentPlayer={currentPlayer || null}
              myTeamId={myTeamId || undefined}
              placeBid={placeBid}
              startNextPlayer={startNextPlayer}
              finalizeSale={() => finalizeSale(false)}
              submitRTMDecision={(decision) => {
                socket.emit("rtm_decision", {
                  roomId: room.id,
                  userId,
                  decision: decision ? 'YES' : 'NO'
                });
              }}
            />
          </div>
          <div className={`h-full ${mobileTab === 'tracker' ? 'block' : 'hidden'}`}><TrackPanel room={room} /></div>
          <div className={`h-full ${mobileTab === 'soldunsold' ? 'block' : 'hidden'}`}><SoldUnsoldPanel room={room} /></div>
          <div className={`h-full ${mobileTab === 'squads' ? 'block' : 'hidden'}`}><SquadPanel room={room} viewedTeamId={viewedTeamId} setViewedTeamId={setViewedTeamId} /></div>
          <div className={`h-full ${mobileTab === 'chat' ? 'block' : 'hidden lg:hidden'}`}><ChatPanel room={room} userId={userId} setRoom={setRoom} /></div>
        </>
      }
    />
  );
};

export default AuctionScreen;
