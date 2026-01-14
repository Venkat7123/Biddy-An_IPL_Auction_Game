import "dotenv/config"; // Load environment variables from .env file
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import registerSockets from "./sockets";

const httpServer = createServer(app);

// Get allowed origins from environment or allow all in development
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS.includes("*") ? "*" : ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  },
  // Increase timeouts for global players with high latency
  pingTimeout: 60000,
  pingInterval: 25000
});
registerSockets(io);

const PORT = parseInt(process.env.PORT || "4000", 10);
const HOST = process.env.HOST || "0.0.0.0"; // Bind to all interfaces for external access

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 Backend running on http://${HOST}:${PORT}`);
  console.log(`🌍 Ready for global multiplayer connections!`);
});
