
import { EventEmitter } from 'events';
import { GameRoom } from './types';

class RoomEvents extends EventEmitter {
    public emitRoomCreated(room: GameRoom) {
        this.emit('room_created', room);
    }

    public onRoomCreated(listener: (room: GameRoom) => void) {
        this.on('room_created', listener);
    }
}

export const roomEvents = new RoomEvents();
