import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import {
  Bell,
  Check,
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const NotificationIcon = ({ type }) => {
  const iconProps = { size: 20, className: "shrink-0" };
  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case "error":
      return <XCircle {...iconProps} className="text-red-500" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="text-yellow-500" />;
    default:
      return <Info {...iconProps} className="text-blue-500" />;
  }
};

const UserNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/notifications/getNotifications`,
        axiosConfig
      );
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      console.log("Marking as read:", id); // Log the ID being sent
      const { data } = await axios.patch(
        `${backendURL}/api/notifications/markNotificationAsRead/${id}`,
        {},
        axiosConfig
      );
      console.log("Response data:", data); // Log the response
      if (data) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => (notif._id === id ? data : notif))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("Notifications state updated:", notifications);
  }, [notifications]);

  const confirmDelete = async () => {
    if (!selectedNotification) return;
    try {
      await axios.delete(
        `${backendURL}/api/notifications/deleteNotification/${selectedNotification._id}`,
        axiosConfig
      );
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notif) => notif._id !== selectedNotification._id
        )
      );
      setShowDeleteAlert(false);
      setSelectedNotification(null);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data } = await axios.patch(
        `${backendURL}/api/notifications/markAllNotificationsAsRead`,
        {},
        axiosConfig
      );
      console.log("Mark all as read response:", data); // Log the response
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteAlert(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mid:mt-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Notifications</h2>
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No notifications yet
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <NotificationIcon type={notification.type} />
              <div className="flex-1">
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{moment(notification.createdAt).fromNow()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(notification)}
                  className="p-1 hover:bg-gray-100 rounded text-red-500"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Alert
        show={showDeleteAlert}
        variant="destructive"
        onClose={() => setShowDeleteAlert(false)}
      >
        <h3 className="text-lg font-semibold mb-2">Delete Notification</h3>
        <AlertDescription>
          Are you sure you want to delete this notification? This action cannot
          be undone.
        </AlertDescription>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteAlert(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </Alert>
    </div>
  );
};

export default UserNotificationPage;
