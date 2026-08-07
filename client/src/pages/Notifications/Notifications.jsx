import { useEffect } from 'react';

import {
  useNotifications,
} from '../../context/useNotifications';

export default function Notifications() {
  const {
    notifications,
    loading,
    error,

    fetchNotifications,

    readNotification,

    readAllNotifications,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications({
      limit: 50,
    });
  }, [fetchNotifications]);

  if (loading) {
    return (
      <div className="card">
        <h2>Notifications</h2>

        <p>
          Loading notifications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Notifications</h2>

        <p
          style={{
            color:
              'var(--color-danger)',
          }}
        >
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between notification-header">
        <h2>Notifications</h2>

        {notifications.length >
          0 && (
          <button
            className="btn btn-primary"
            onClick={
              readAllNotifications
            }
          >
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length ===
      0 ? (
        <div className="notification-empty"
          style={{
            padding: 40,
            textAlign: 'center',
            color:
              'var(--color-text-muted)',
          }}
        >
          No notifications available.
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(
            (notification) => (
              <div
                key={
                  notification._id
                }
                className="card"
                style={{
                  borderLeft:
                    notification.read
                      ? '4px solid var(--border)'
                      : '4px solid var(--color-primary)',

                  background:
                    notification.read
                      ? 'var(--surface)'
                      : 'var(--color-bg-surface-raised)',

                  cursor:
                    'pointer',
                }}
                onClick={() =>
                  readNotification(
                    notification._id
                  )
                }
              >
                <div className="notification-item-header">
                  <strong>
                    {notification.title ||
                      'Notification'}
                  </strong>

                  {!notification.read && (
                    <span className="notification-new">
                      NEW
                    </span>
                  )}
                </div>

                <div className="notification-message">
                  {
                    notification.message
                  }
                </div>

                <div className="notification-time">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}