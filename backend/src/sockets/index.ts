import { Server } from "socket.io";
import roomSocket from "./room.socket";
import auctionSocket from "./auction.socket";
import chatSocket from "./chat.socket";
import hostSocket from "./host.socket";

import { roomEvents } from "../shared/roomEvents";

export default function registerSockets(io: Server) {
    // Listen for internal room creation events and broadcast to all clients
    roomEvents.onRoomCreated((room) => {
        if (room.roomType === 'PUBLIC') {
            const summary = {
                id: room.id,
                name: room.name,
                hostName: room.players[room.hostId]?.name || 'Unknown',
                playersCount: Object.keys(room.players).length
            };
            io.emit("public_room_added", summary); // Broadcast to everyone
        }
    });

    io.on("connection", (socket) => {

        roomSocket(io, socket);
        auctionSocket(io, socket);
        chatSocket(io, socket);
        hostSocket(io, socket);

        socket.on("disconnect", () => {
        });
    });
}
