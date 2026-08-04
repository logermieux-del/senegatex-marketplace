'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export function NotificationBadge() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications?limit=5');
      if (!res.ok) return;

      const data = await res.json();
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'mark-all-read' }),
      });
      setUnreadCount(0);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'delete', notificationId: id }),
      });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.isRead
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {notification.actionUrl ? (
                        <Link
                          href={notification.actionUrl}
                          onClick={() => setIsOpen(false)}
                          className="hover:underline"
                        >
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                          </h4>
                        </Link>
                      ) : (
                        <h4 className="font-semibold text-sm">
                          {notification.title}
                        </h4>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <time className="text-xs text-gray-500 mt-1 block">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </time>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - View All Link */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-500 hover:text-blue-700 font-medium"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
