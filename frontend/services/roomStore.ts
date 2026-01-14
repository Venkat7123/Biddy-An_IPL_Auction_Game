
import { GameRoom } from '../types';

/**
 * A simple global store to simulate a server-side registry of public rooms.
 * In a real app, this would be handled by a backend database/websocket server.
 */

let publicRooms: GameRoom[] = [];

export const roomStore = {
  getPublicRooms: () => [...publicRooms],
  
  addPublicRoom: (room: GameRoom) => {
    // Check if room already exists, if so update it
    const existingIndex = publicRooms.findIndex(r => r.id === room.id);
    if (existingIndex !== -1) {
      publicRooms[existingIndex] = room;
    } else {
      publicRooms.push(room);
    }
  },
  
  updatePublicRoom: (room: GameRoom) => {
    const existingIndex = publicRooms.findIndex(r => r.id === room.id);
    if (existingIndex !== -1) {
      publicRooms[existingIndex] = room;
    }
  },
  
  removePublicRoom: (roomId: string) => {
    publicRooms = publicRooms.filter(r => r.id !== roomId);
  }
};
