import { Server } from "socket.io";
import roomSocket from "./room.socket";
import auctionSocket from "./auction.socket";
import chatSocket from "./chat.socket";
import hostSocket from "./host.socket";

export default function registerSockets(io: Server) {
    io.on("connection", (socket) => {

        roomSocket(io, socket);
        auctionSocket(io, socket);
        chatSocket(io, socket);
        hostSocket(io, socket);

        socket.on("disconnect", () => {
        });
    });
}
