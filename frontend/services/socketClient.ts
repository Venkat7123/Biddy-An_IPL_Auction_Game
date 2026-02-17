/// <reference types="vite/client" />
import { io, Socket } from "socket.io-client";

/**
 * Singleton Socket.IO client
 * - Connects once for the entire app
 * - No UI or component coupling
 * - Uses environment variable for server URL (supports global multiplayer)
 */

// Use environment variable or fallback to localhost for development
// In production, set VITE_SOCKET_URL to your deployed backend URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://biddy.onrender.com";

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // Allow polling fallback for restrictive networks
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000, // Longer timeout for global connections
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("🔴 Connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Reconnected after", attemptNumber, "attempts");
});

export default socket;
