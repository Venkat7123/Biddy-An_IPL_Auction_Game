import { Server, Socket } from "socket.io";

export default function chatSocket(io: Server, socket: Socket) {
  socket.on("send_message", ({ roomId, user, text }) => {
    if (!roomId || !text) return;

    const message = {
      user,
      text,
      time: Date.now(),
    };

    io.to(roomId).emit("chat_update", message);
  });
}
