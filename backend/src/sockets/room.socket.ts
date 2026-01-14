import { Server, Socket } from "socket.io";
import store from "../store/memory.store";

export default function roomSocket(io: Server, socket: Socket) {
    socket.on("join_room", ({ roomId, user }) => {
        const room = store.rooms.get(roomId);
        if (!room) return;

        socket.join(roomId);

        const snapshot = store.getRoomSnapshot(roomId);
        if (!snapshot) return;

        // send ONLY to the joining socket
        socket.emit("room_snapshot", snapshot);

        // notify others (optional)
        io.to(roomId).emit("room_update", snapshot.room);

    });
}
