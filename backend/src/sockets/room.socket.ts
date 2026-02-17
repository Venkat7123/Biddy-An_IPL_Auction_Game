
import { Server, Socket } from "socket.io";
import store from "../store/memory.store";

export default function roomSocket(io: Server, socket: Socket) {
    socket.on("join_room", ({ roomId, userId, userName }) => {
        const room = store.getRoom(roomId);
        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        socket.join(roomId);

        // Add user to room if not already present
        if (!room.players[userId]) {
            room.players[userId] = {
                name: userName,
                isSpectator: true, // Default to spectator
                isAdmin: false,
                teamId: null
            };
        }

        // Update user connection status (optional, for future use)
        // store.updateUserSocket(userId, socket.id);

        io.to(roomId).emit("room_update", room);
    });

    socket.on("select_team", ({ roomId, userId, teamId }) => {
        const room = store.getRoom(roomId);
        if (!room) return;

        // Validation: Check if team is taken by another user
        const isTaken = Object.values(room.players).some(p => p.teamId === teamId && p.name !== room.players[userId]?.name && typeof p.teamId === 'string');
        // Better check: iterate entries to check ID? 
        // room.players is Record<userId, Player>. 
        // We can check if any entry has teamId === requestedTeamId AND entry.key !== userId.
        const entries = Object.entries(room.players);
        const takenByOther = entries.some(([pid, val]) => val.teamId === teamId && pid !== userId);

        if (takenByOther) {
            socket.emit("error", { message: "Team already taken" });
            return;
        }

        // Update player
        if (room.players[userId]) {
            room.players[userId].teamId = teamId;
            room.players[userId].isSpectator = false;
        }

        // Update team owner
        if (room.teams[teamId]) {
            room.teams[teamId].ownerId = userId;
        }

        io.to(roomId).emit("room_update", room);
    });

    socket.on("leave_room", ({ roomId, userId }) => {
        const room = store.getRoom(roomId);
        if (!room) return;

        socket.leave(roomId);

        // If host leaves
        if (room.hostId === userId) {
            if (room.status === 'lobby') {
                // Host leaving from lobby: disband the room entirely
                io.to(roomId).emit("room_disbanded", { message: "The host has closed this room." });
                // Notify all clients to remove from public rooms list
                if (room.roomType === 'PUBLIC') {
                    io.emit("public_room_removed", { roomId });
                }
                store.deleteRoom(roomId);
            } else {
                // Host leaving during auction: show final summary, then clean up
                room.status = 'finished';
                room.auction.status = 'idle';
                room.auction.currentPlayerId = null;
                room.auction.currentBid = 0;
                room.auction.highestBidderId = null;
                room.auction.highestBidderTeamId = null;

                room.chat.push({
                    id: Date.now().toString() + Math.random(),
                    senderName: 'System',
                    text: '🚪 The host has left. The auction has ended.',
                    type: 'system',
                    timestamp: Date.now()
                });

                io.to(roomId).emit("room_update", room);

                // Clean up room from store after a delay so clients can render FinalSummary
                setTimeout(() => {
                    store.deleteRoom(roomId);
                }, 60000); // 1 minute delay
            }
        } else {
            if (room.status === 'LIVE') {
                // During auction: keep player data so they can rejoin
                // Just leave the socket room
                io.to(roomId).emit("room_update", room);
            } else {
                // In lobby: remove player and free their team
                delete room.players[userId];
                const playerTeamId = Object.values(room.teams).find(t => t.ownerId === userId)?.id;
                if (playerTeamId) {
                    room.teams[playerTeamId].ownerId = undefined;
                }
                io.to(roomId).emit("room_update", room);
            }
        }
    });

    socket.on("send_message", ({ roomId, userId, message }) => {
        console.log(`[CHAT] (${roomId}) ${userId}: ${message}`);
        const room = store.getRoom(roomId);
        if (!room) return;

        const player = room.players[userId];
        if (!player) return;

        const chatMsg = {
            id: Date.now().toString(),
            senderName: player.name,
            text: message,
            type: 'user' as const,
            timestamp: Date.now()
        };

        room.chat.push(chatMsg);

        if (room.chat.length > 50) {
            room.chat = room.chat.slice(-50);
        }

        io.to(roomId).emit("room_update", room);
    });
}
