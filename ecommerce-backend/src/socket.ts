import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server;

// In-memory notification store for admin (persists until server restart)
const adminNotifications: {
  id: string;
  type: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: Date;
}[] = [];

interface JwtPayload {
  id: string;
  role: string;
}

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

    // Join room based on user role - validate token before allowing admin access
    socket.on('join', (data: { userId: string; role: string; token?: string }) => {
      socket.join(`user:${data.userId}`);
      if (data.role === 'superAdmin' && data.token) {
        try {
          const jwtSecret = process.env.JWT_SECRET;
          if (!jwtSecret) return;
          const decoded = jwt.verify(data.token, jwtSecret) as JwtPayload;
          if (decoded.role === 'superAdmin') {
            socket.join('admin');
            // Send existing unread notifications
            const unread = adminNotifications.filter((n) => !n.read);
            socket.emit('notifications:initial', unread);
          }
        } catch {
          // Invalid token - don't join admin room
        }
      }
    });

    // Mark notification as read
    socket.on('notification:read', (notificationId: string) => {
      const notification = adminNotifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    });

    // Mark all notifications as read
    socket.on('notifications:readAll', () => {
      adminNotifications.forEach((n) => (n.read = true));
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
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'order:new',
      message: `New order #${order._id.toString().slice(-6).toUpperCase()} placed - $${order.totalPrice.toFixed(2)}`,
      data: {
        orderId: order._id,
        totalPrice: order.totalPrice,
        itemCount: order.items.length,
      },
      read: false,
      createdAt: new Date(),
    };
    adminNotifications.unshift(notification);
    // Keep only last 50 notifications
    if (adminNotifications.length > 50) adminNotifications.length = 50;
    io.to('admin').emit('order:new', notification);
  }
};

export const emitOrderStatusUpdate = (
  userId: string,
  order: any
): void => {
  if (io) {
    // Notify the customer
    io.to(`user:${userId}`).emit('order:statusUpdate', {
      orderId: order._id,
      status: order.status,
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} is now ${order.status}`,
    });
    // Notify admin dashboard to refresh
    io.to('admin').emit('dashboard:refresh');
  }
};
