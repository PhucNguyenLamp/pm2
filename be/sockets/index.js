import { Server } from 'socket.io';

let io;

export function initSocket(server) {
    if (io) {
        return io;
    }

    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO is not initialized yet');
    }

    return io;
}

export function sendLocationToClients(location) {
    getIO().emit('location', location);
}

