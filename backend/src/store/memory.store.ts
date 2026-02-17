
import { GameRoom, User } from "../shared/types";

class MemoryStore {
  rooms = new Map<string, GameRoom>();

  createRoom(room: GameRoom) {
    this.rooms.set(room.id, room);
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  updateRoom(roomId: string, updates: Partial<GameRoom>) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const updated = { ...room, ...updates };
    this.rooms.set(roomId, updated);
    return updated;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  getAuction(roomId: string) {
    const room = this.rooms.get(roomId);
    return room ? room.auction : null;
  }
}

const store = new MemoryStore();
export default store;
