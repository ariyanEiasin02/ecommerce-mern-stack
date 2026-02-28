import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001',
      ],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room based on user role
    socket.on('join', (data: { userId: string; role: string }) => {
      socket.join(`user:${data.userId}`);
      if (data.role === 'superAdmin') {
        socket.join('admin');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Emit events
export const emitOrderCreated = (order: any): void => {
  if (io) {
    io.to('admin').emit('order:new', order);
  }
};

export const emitOrderStatusUpdate = (
  userId: string,
  order: any
): void => {
  if (io) {
    io.to(`user:${userId}`).emit('order:statusUpdate', order);
    io.to('admin').emit('dashboard:refresh');
  }
};
