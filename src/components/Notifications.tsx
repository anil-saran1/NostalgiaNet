import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fetchNotificationsList from "./utils/fetchNotificationsList";
import markNotificationAsRead from "./utils/markNotificationAsRead";
import handleActionNotification from "./utils/handleActionNotification";
import NotificationItem from "./NotificationItem";
import { auth } from "../firebaseConfig";
import clearAllReadNotifications from "./utils/clearAllReadNotifications";

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userId = auth.currentUser?.uid; 
  if (!userId) return null;

  useEffect(() => {
    fetchNotifications();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unreadCount = notifications.filter(
      (notif) => !notif.isRead
    ).length;
    setUnreadCount(unreadCount);
  }, [notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const fetchedNotifications = await fetchNotificationsList();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const staticNotifications = notifications.filter(
        (notif) =>
          notif.type !== "friendRequest" && notif.type !== "journalInvite"
      );
      staticNotifications.forEach((notif) => {
        markNotificationAsRead(userId, notif.id);
        const updatedNotifications = notifications.map((n) =>
          n.id === notif.id
            ? {
                ...n,
                isRead: true,
              }
            : n
        );
        setNotifications(updatedNotifications);
      });

      const unreadCountAfterRead = notifications.filter(
        (notif) => !notif.isRead
      ).length;
      setUnreadCount(unreadCountAfterRead);
    }
  };

  const handleAction = async (notif: any, action: string) => {
    if (action === "decline") {
      const updatedNotifications = notifications.filter(
        (n) => n.id !== notif.id
      );
      setNotifications(updatedNotifications);
    } else if (action === "accept") {
      const updatedNotifications = notifications.map((n) =>
        n.id === notif.id
          ? {
              ...n,
              isRead: true,
              type: notif.type === 'friendRequest' ? "acceptedRequest" : "acceptedInvite",
              timestamp: Date.now(),
            }
          : n
      );
      setNotifications(updatedNotifications);
    }
 
    await handleActionNotification(notif, action);
  };

  const clearAllRead = async () => {
    const remainingNotifications = notifications.filter(
      (notif) => !notif.isRead
    );
    setNotifications(remainingNotifications);

    try {
      await clearAllReadNotifications(userId);
      console.log("Cleared all read notifications.");
    } catch (error) {
      console.error("Error clearing read notifications:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-auto relative">
      <button onClick={toggleDropdown} className="focus:outline-none link-pointer relative">
        <svg
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white mx-4 size-8"
        >
          <circle cx="19.5" cy="19.5" r="19.5" fill="white" />
          <path
            d="M13.5025 13.9752C13.7849 11.1508 16.1616 9 19 9C21.8384 9 24.2151 11.1508 24.4975 13.9752L24.7841 16.8413C24.8016 17.0156 24.8103 17.1028 24.8207 17.1885C24.9649 18.3717 25.3717 19.5077 26.0113 20.5135C26.0576 20.5865 26.1062 20.6593 26.2034 20.8051L27.0645 22.0968C27.8508 23.2763 28.244 23.866 28.0715 24.3412C28.0388 24.4311 27.9935 24.5158 27.9368 24.5928C27.6371 25 26.9283 25 25.5108 25H12.4892C11.0717 25 10.3629 25 10.0632 24.5928C10.0065 24.5158 9.96117 24.4311 9.92854 24.3412C9.75601 23.866 10.1492 23.2763 10.9355 22.0968L11.7966 20.8051C11.8938 20.6593 11.9424 20.5865 11.9887 20.5135C12.6283 19.5077 13.0351 18.3717 13.1793 17.1885C13.1897 17.1028 13.1984 17.0156 13.2159 16.8413L13.5025 13.9752Z"
            fill="#131312"
          />
          <path
            d="M17.0681 27.6294C17.1821 27.7357 17.4332 27.8297 17.7825 27.8967C18.1318 27.9637 18.5597 28 19 28C19.4403 28 19.8682 27.9637 20.2175 27.8967C20.5668 27.8297 20.8179 27.7357 20.9319 27.6294"
            stroke="#131312"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (<div className="absolute cursor-pointer link-pointer w-full h-full z-50"></div>)}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{
              scale: 0.2,
              y: -70,
              x: 200,
              opacity: 0,
              transformOrigin: "bottom",
            }}
            animate={{
              scale: 1,
              y: 80,
              x: -60,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            exit={{
              scale: 0.2,
              y: -170,
              x: 200,
              opacity: 0,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="absolute h-[200px] overflow-y-auto right-0 mt-2 w-[500px] bg-white rounded-lg shadow-lg py-4 z-[100]"
          >
            <div className="font-bold px-4 flex justify-between items-center">
              Notifications
              <div className="flex space-x-2">
                <button
                  onClick={clearAllRead}
                  className="text-xs bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  Clear All Read
                </button>
                <button
                  onClick={fetchNotifications}
                  className="text-xs bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="flex gap-2 px-4 border-b">
              <button
                className={`w-auto pt-2 text-center mx-3 ${
                  activeTab === "general"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500 font-light"
                }`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                className={`w-auto pt-2 mx-3 text-center ${
                  activeTab === "inbox"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500 font-light"
                }`}
                onClick={() => setActiveTab("inbox")}
              >
                Inbox
              </button>
              <button
                className={`w-auto pt-2 mx-3 text-center ${
                  activeTab === "invites"
                    ? "border-b-2 border-black font-bold"
                    : "text-gray-500 font-light"
                }`}
                onClick={() => setActiveTab("invites")}
              >
                Invites
              </button>
            </div>

            <div className="mt-4 px-4 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="loader border-t-4 border-gray-400 border-solid rounded-full w-8 h-8 animate-spin"></div>
                </div>
              ) : (
                <>
                  {activeTab === "general" && (
                    <div className="space-y-2">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <NotificationItem
                            key={notif.id}
                            notif={notif} // Pass the entire notif object
                            onAction={(action) => handleAction(notif, action)}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No general notifications
                        </p>
                      )}
                    </div>
                  )}
                  {activeTab === "inbox" && (
                    <div className="space-y-2">
                      {notifications.filter(
                        (notif) => notif.type != "friendRequest"
                      ).length > 0 ? (
                        notifications
                          .filter((notif) => notif.type === "friendRequest")
                          .map((notif) => (
                            <NotificationItem
                              key={notif.id}
                              notif={notif} // Pass the entire notif object
                              onAction={(action) => handleAction(notif, action)}
                            />
                          ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No messages in Inbox
                        </p>
                      )}
                    </div>
                  )}
                  {activeTab === "invites" && (
                    <div className="space-y-2">
                      {notifications.filter(
                        (notif) => notif.type === "friendRequest"
                      ).length > 0 ? (
                        notifications
                          .filter((notif) => notif.type === "friendRequest")
                          .map((notif) => (
                            <NotificationItem
                              key={notif.id}
                              notif={notif} // Pass the entire notif object
                              onAction={(action) => handleAction(notif, action)}
                            />
                          ))
                      ) : (
                        <p className="text-sm text-gray-500">No new invites</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
