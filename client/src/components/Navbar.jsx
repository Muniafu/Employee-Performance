import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, Bell } from 'lucide-react';

import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { useNotifications } from "../context/useNotifications";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
    error = "",
    fetchNotifications,
    readNotification,
  } = useNotifications() || {};

  const [open, setOpen] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const toggleNotifications = () => {
    const nextState = !open;

    setOpen(nextState);

    if (nextState) {
      fetchNotifications?.({
        limit: 10,
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await readNotification?.(notification._id);

      if (notification.link) {
        navigate(notification.link);
      }

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={onMenuClick}
        aria-label="Open Sidebar"
      >
        <Menu size={22}/>
      </button>

      <div className="topbar-spacer" />

      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={toggle}
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <Moon /> : <Sun />}
      </button>

      <div
        className="notification-wrapper"
        ref={notificationRef}
      >
        <button
          type="button"
          className="btn btn-ghost btn-icon notification-trigger"
          onClick={toggleNotifications}
          aria-label="Notifications"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <Bell size={20}/>

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9
                ? "9+"
                : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <strong>Notifications</strong>

              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  navigate("/notifications");
                  setOpen(false);
                }}
              >
                View All
              </button>
            </div>

            {loading && (
              <p className="notification-empty">
                Loading notifications...
              </p>
            )}

            {!loading && error && (
              <p className="notification-error">
                {error}
              </p>
            )}

            {!loading &&
              !error &&
              notifications.length === 0 && (
                <p className="notification-empty">
                  No notifications yet.
                </p>
              )}

            {!loading &&
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  className="notification-item"
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                >
                  <div className="notification-title">
                    {notification.title}
                  </div>

                  <div className="notification-message">
                    {notification.message}
                  </div>

                  <div className="notification-time">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="topbar-profile">
        <div className="avatar">
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </div>

        <div className="topbar-user">
          <div className="topbar-user-name">
            {user?.firstName} {user?.lastName}
          </div>

          <div
            className={`topbar-user-role role-${(
              user?.role || "employee"
            ).toLowerCase()}`}
          >
            {user?.role || "Employee"}
          </div>
        </div>
      </div>
    </header>
  );
}