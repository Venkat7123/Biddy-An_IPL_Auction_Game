/**
 * Centralized REST API client
 * Keeps backend calls out of UI components
 * Uses environment variable for server URL (supports global multiplayer)
 */

// Use environment variable or fallback to localhost for development
// In production, set VITE_API_URL to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "API request failed");
  }

  return response.json();
}

/* =========================
   ROOM APIs
   ========================= */

export function createRoom(hostName: string, isPublic: boolean, hostUserId?: string) {
  return request<{ roomId: string }>("/rooms", {
    method: "POST",
    body: JSON.stringify({ hostName, isPublic, hostUserId }),
  });
}

export function getRoomSummary(roomId: string) {
  return request(`/rooms/${roomId}/summary`);
}

export function getPublicRooms() {
  return request<{ id: string; name: string; hostName: string; playersCount: number }[]>("/rooms");
}
