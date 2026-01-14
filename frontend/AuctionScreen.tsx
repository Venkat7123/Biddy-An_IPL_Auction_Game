
import React, { useState, useEffect, useRef } from 'react';
import { GameRoom, Player } from './types';
import { PLAYERS, TEAMS, MAX_OVERSEAS, MAX_SQUAD, mapSlab } from './constants';
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

const getDynamicIncrement = (currentBid: number): number => {
  if (currentBid < 1.0) return 0.05;
  if (currentBid < 2.0) return 0.10;
  if (currentBid < 5.0) return 0.20;
  return 0.25;
};

const AuctionScreen: React.FC<AuctionScreenProps> = ({ room, userId, onLeave, setRoom }) => {
  const [timer, setTimer] = useState(room.auction.bidTimeLimit);
  const [rtmTimer, setRtmTimer] = useState(10);
  const [isBidding, setIsBidding] = useState(false);
  const [viewedTeamId, setViewedTeamId] = useState<string>(room.players[userId]?.teamId || 'csk');
  const [mobileTab, setMobileTab] = useState<'auction' | 'tracker' | 'soldunsold' | 'squads' | 'chat'>('auction');
  const [leftSidebarTab, setLeftSidebarTab] = useState<'tracker' | 'soldunsold'>('tracker');
  const [rightSidebarTab, setRightSidebarTab] = useState<'chat' | 'squads'>('chat');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPlayer = room.auction.currentPlayerId
    ? PLAYERS.find(p => p.id === room.auction.currentPlayerId)
    : null;

  const myTeamId = room.players[userId]?.teamId;
  const myTeamState = myTeamId ? room.teams[myTeamId] : null;
  const isHost = room.hostId === userId;
  const isSpectator = room.players[userId]?.isSpectator || !myTeamId;

  useEffect(() => {
    const handleAuctionUpdate = (update: {
      currentBid: number;
      highestBidderId: string;
      highestBidderTeamId: string;
    }) => {
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          auction: {
            ...prev.auction,
            currentBid: update.currentBid,
            highestBidderId: update.highestBidderId,
            highestBidderTeamId: update.highestBidderTeamId,
            bidIncrement: getDynamicIncrement(update.currentBid),
          },
        };
      });

      audioService.playBid();
      setIsBidding(true);
      setTimeout(() => setIsBidding(false), 200);
    };

    socket.on("auction_update", handleAuctionUpdate);

    return () => {
      socket.off("auction_update", handleAuctionUpdate);
    };
  }, [setRoom]);

  useEffect(() => {
    socket.on("bid_rejected", ({ reason }) => {
      setToast({ msg: reason, type: "info" });
    });

    return () => {
      socket.off("bid_rejected");
    };
  }, []);

  useEffect(() => {
    if (isHost && room.status === 'LIVE' && room.auction.status === 'idle') {
      const timeout = setTimeout(() => startNextPlayer(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [room.status, room.auction.status, isHost]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    socket.on("player_started", (auction) => {
      setRoom(prev => prev ? ({
        ...prev,
        auction
      }) : null);
    });

    socket.on("player_unsold", (auction) => {
      setRoom(prev => prev ? ({
        ...prev,
        auction
      }) : null);
    });

    socket.on("player_sold", (auction) => {
      setRoom(prev => prev ? ({
        ...prev,
        auction
      }) : null);
    });

    socket.on("set_skipped", () => {
      // optional toast only
      setToast({ msg: "Set skipped by host", type: "info" });
    });

    return () => {
      socket.off("player_started");
      socket.off("player_unsold");
      socket.off("player_sold");
      socket.off("set_skipped");
    };
  }, [setRoom]);

  useEffect(() => {
    const handleSnapshot = ({ room, auction }: any) => {
      setRoom(prev => {
        if (!prev) return room;
        return {
          ...room,
          auction,
        };
      });
    };

    socket.on("room_snapshot", handleSnapshot);

    return () => {
      socket.off("room_snapshot", handleSnapshot);
    };
  }, [setRoom]);


  useEffect(() => {
    const handleTimerUpdate = ({ remainingTime }: { remainingTime: number }) => {
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          auction: {
            ...prev.auction,
            remainingTime,
          },
        };
      });
    };

    socket.on("timer_update", handleTimerUpdate);

    socket.on("auction_ended", () => {
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          auction: {
            ...prev.auction,
            status: "unsold", // or "sold" will be decided next
          },
        };
      });
    });


    return () => {
      socket.off("timer_update", handleTimerUpdate);
      socket.off("auction_ended");
    };
  }, [setRoom]);

  const startNextPlayer = () => {
    const pendingPlayers = PLAYERS.filter(p => room.playersPool[p.id].status === 'PENDING');
    if (pendingPlayers.length === 0) {
      socket.emit("host_action", {
        roomId: room.id,
        userId,
        action: {
          type: "START_NEXT_PLAYER",
          player: currentPlayer
        }
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
      action: {
        type: "START_NEXT_PLAYER",
        player: currentPlayer
      }
    });

    setTimer(room.auction.bidTimeLimit);
    setRtmTimer(10);
  };

  const handleAuctionEnd = async () => {
    if (!room.auction.highestBidderId || !currentPlayer) {
      const price = room.auction.currentBid;
      const playerName = currentPlayer?.name || 'Player';
      audioService.playUnsold();
      socket.emit("host_action", {
        roomId: room.id,
        userId,
        action: {
          type: room.auction.highestBidderId ? "FINALIZE_SALE" : "MARK_UNSOLD"
        }
      });


      const aiCommentary = await getAuctioneerCommentary(playerName, price, "None", false);
      setRoom(prev => prev ? {
        ...prev,
        chat: [...prev.chat, { id: `ai-unsold-${Date.now()}`, senderName: 'System', text: aiCommentary, type: 'system', timestamp: Date.now() }]
      } : prev);

      setTimeout(() => startNextPlayer(), 1500);
      return;
    }

    const formerTeamId = currentPlayer.formerTeamId;
    const hasRTM = formerTeamId && room.teams[formerTeamId]?.rtmCards > 0 && formerTeamId !== room.auction.highestBidderTeamId;

    if (hasRTM) {
      setRoom(prev => prev ? ({ ...prev, auction: { ...prev.auction, status: 'rtm_pending', rtmTeamId: formerTeamId!, rtmStartTime: Date.now() } }) : null);
      audioService.playRtm();
      setRtmTimer(10);
    } else {
      finalizeSale(false);
    }
  };

  const finalizeSale = async (rtmUsed: boolean) => {
    if (!room.auction.currentPlayerId) return;

    const soldToTeamId = rtmUsed ? room.auction.rtmTeamId! : room.auction.highestBidderTeamId!;
    const price = room.auction.currentBid;
    const player = PLAYERS.find(p => p.id === room.auction.currentPlayerId)!;
    const teamShort = TEAMS.find(t => t.id === soldToTeamId)?.shortName || "Team";

    audioService.playHammer();

    setRoom(prev => {
      if (!prev) return null;

      const updatedTeams = { ...prev.teams };
      const team = updatedTeams[soldToTeamId];
      updatedTeams[soldToTeamId] = {
        ...team,
        purse: team.purse - price,
        squad: [...team.squad, { ...player, boughtPrice: price, isRetained: false }],
        rtmCards: rtmUsed ? team.rtmCards - 1 : team.rtmCards
      };

      const pool = { ...prev.playersPool };
      pool[player.id] = { status: 'SOLD', winningTeamId: soldToTeamId, finalPrice: price };

      return {
        ...prev,
        teams: updatedTeams,
        playersPool: pool,
        auction: { ...prev.auction, status: 'sold' }
      };
    });

    const aiCommentary = await getAuctioneerCommentary(player.name, price, teamShort, true);
    setRoom(prev => prev ? {
      ...prev,
      chat: [...prev.chat, { id: `ai-sold-${Date.now()}`, senderName: 'System', text: aiCommentary, type: 'system', timestamp: Date.now() }]
    } : prev);

    if (isHost) {
      setTimeout(() => startNextPlayer(), 2000);
    }
  };

  const placeBid = () => {
    if (isSpectator || !myTeamState || !currentPlayer || room.auction.status !== 'bidding') return;

    const increment = getDynamicIncrement(room.auction.currentBid);
    const nextBid = room.auction.highestBidderId ? room.auction.currentBid + increment : room.auction.currentBid;

    if (myTeamState.purse < nextBid) {
      setToast({ msg: 'Insufficient Budget.', type: 'info' });
      return;
    }
    if (myTeamState.squad.length >= MAX_SQUAD) {
      setToast({ msg: 'Squad capacity reached (MAX 25).', type: 'info' });
      return;
    }
    const osCount = myTeamState.squad.filter(p => p.isOverseas).length;
    if (currentPlayer.isOverseas && osCount >= MAX_OVERSEAS) {
      setToast({ msg: 'Overseas limit reached (MAX 8).', type: 'info' });
      return;
    }

    const teamShort = TEAMS.find(t => t.id === myTeamId)?.shortName || 'Team';

    socket.emit("place_bid", {
      roomId: room.id,
      userId,
      teamId: myTeamId,
      amount: nextBid,
    });


    setTimer(room.auction.bidTimeLimit);
    setIsBidding(true);
    audioService.playBid();
    setTimeout(() => setIsBidding(false), 200);
  };

  const skipPlayer = () => {
    if (!isHost || !currentPlayer) return;
    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: { type: "MARK_UNSOLD" }
    });
    setToast({ msg: `${currentPlayer.name} marked as unsold.`, type: 'info' });

  };

  const skipSet = () => {
    if (!isHost || !room.auction.currentSetNo) return;
    const set = room.auction.currentSetNo;
    socket.emit("host_action", {
      roomId: room.id,
      userId,
      action: {
        type: "SKIP_SET",
        setNo: room.auction.currentSetNo
      }
    });

    setToast({ msg: `Set ${set} skipped.`, type: 'info' });
  };

  const changeTimerLimit = (val: number) => {
    if (!isHost) return;
    setRoom(prev => prev ? ({ ...prev, auction: { ...prev.auction, bidTimeLimit: val } }) : null);
    setToast({ msg: `Timer: ${val}s`, type: 'info' });
  };

  if (room.status === 'finished') {
    return <FinalSummary room={room} onExit={onLeave} />;
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
        />
      }
      summaryBar={<SummaryBar room={room} />}
      toast={toast && (
        <div className={`fixed top-32 left-1/2 -translate-x-1/2 z-[100] px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white'} font-black text-xs uppercase tracking-widest`}>
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
              finalizeSale={finalizeSale}
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
