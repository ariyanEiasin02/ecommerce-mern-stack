"use client";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface Notification {
  id: string;
  type: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: string;
}

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace("/api", "");

const NotificationBell: React.FC = () => {
  const { user } = useAdminAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { userId: user._id, role: user.role });
    });

    // Receive initial notifications
    socket.on("notifications:initial", (data: Notification[]) => {
      setNotifications(data);
    });

    // New order notification
    socket.on("order:new", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 30));
    });

    // Dashboard refresh trigger
    socket.on("dashboard:refresh", () => {
      // Could trigger a global refresh event
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    socketRef.current?.emit("notifications:readAll");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    socketRef.current?.emit("notification:read", id);
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="header-icon-btn"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fi fi-rr-bell"></i>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown__header">
            <h6>Notifications</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-sm btn-link"
                onClick={markAllRead}
                style={{ fontSize: 12, textDecoration: "none" }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-dropdown__body">
            {notifications.length === 0 ? (
              <div className="notification-dropdown__empty">
                <i
                  className="fi fi-rr-bell"
                  style={{ fontSize: 24, color: "#d1d5db" }}
                ></i>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.read ? "notification-item--unread" : ""}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notification-item__icon">
                    <i
                      className={
                        notif.type === "order:new"
                          ? "fi fi-rr-shopping-cart"
                          : "fi fi-rr-bell"
                      }
                    ></i>
                  </div>
                  <div className="notification-item__content">
                    <p className="notification-item__message">
                      {notif.message}
                    </p>
                    <span className="notification-item__time">
                      {getTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.read && <span className="notification-item__dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
