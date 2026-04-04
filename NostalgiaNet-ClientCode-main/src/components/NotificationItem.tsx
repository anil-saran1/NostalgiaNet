import React, { useEffect, useState } from "react";
import calculateTimeLeft from "./utils/calculateTimeLeft";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notif: any;
  onAction?: (action: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notif,
  onAction,
}) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = Date.now();
      const timeAgoString = calculateTimeLeft(now, notif.timestamp); // Call the utility function
      setTimeAgo(timeAgoString);
    };

    calculateTimeAgo(); // Initial calculation

    const timerId = setInterval(calculateTimeAgo, 60000); // Update every minute
    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, [notif.timestamp]);

  const navigate = useNavigate();
  switch (notif.type) {
    case "friendRequest":
      return (
        <div className="flex items-center justify-between p-2 font-Inter bg-[#F2F0F0] rounded-xl">
          <div className="link-pointer flex">
            <img onClick={() => navigate(`/user/${notif.friendUid}`)} 
              className="w-10 h-10 rounded-full border-[3px] border-white"
              src={notif.pfp || "/default-pfp.png"}
              alt="User avatar"
              referrerPolicy="no-referrer"
            />
            <div className="ml-4 flex flex-col gap-2 text-left">
              <div className="text-sm font-extralight">
                <span onClick={() => navigate(`/user/${notif.friendUid}`)}  className="font-bold">{notif.sender}</span>{" "}
                {"Sent you a friend request"}
                <p className="text-xs text-left font-normal font-Inter text-[#AAAAAA]">
                  {timeAgo} ago
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm px-4 py-1 w-24 bg-white rounded-full"
                  onClick={() => onAction && onAction("decline")}
                >
                  DECLINE
                </button>
                <button
                  className="text-sm px-4 py-1 w-24 bg-black text-white rounded-full"
                  onClick={() => onAction && onAction("accept")}
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`h-3 w-3 ${
                notif.isRead ? "bg-gray-400" : "bg-green-500"
              } rounded-full`}
            />
          </div>
        </div>
      );

    case "acceptedRequest":
      return (
        <div className="flex items-center justify-between p-2 font-Inter bg-[#F2F0F0] rounded-xl">
          <div onClick={() => navigate(`/user/${notif.friendUid}`)} className="link-pointer flex">
            <img
              className="w-10 h-10 rounded-full border-[3px] border-white"
              src={notif.pfp || "/default-pfp.png"}
              alt="User avatar"
              referrerPolicy="no-referrer"
            />
            <div className="ml-4 flex flex-col gap-2 text-left">
              <div className="text-sm  font-extralight">
                {"You are now friends with"}{" "}
                <span className="font-bold">{notif.sender}</span>
                <p className="text-xs text-left font-normal font-Inter text-[#AAAAAA]">
                  {timeAgo} ago
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`h-3 w-3 ${
                notif.isRead ? "bg-gray-400" : "bg-green-500"
              } rounded-full`}
            />
          </div>
        </div>
      );

    case "journalInvite":
      return (
        <div className="flex items-center justify-between p-2 font-Inter bg-[#F2F0F0] rounded-xl">
          <div className="flex">
            <img
              className="w-10 h-10 rounded-full border-[3px] border-white"
              src={notif.pfp || "/default-pfp.png"}
              alt="User avatar"
              referrerPolicy="no-referrer"
            />
            <div className="ml-4 flex flex-col gap-2 text-left">
              <div className="text-sm font-extralight">
                <span className="font-bold">{notif.sender}</span>{" "}
                {"Sent you a journal invite to"}{" "}
                <span className="font-bold">{notif.contentTitle}</span>
                <p className="text-xs text-left font-normal font-Inter text-[#AAAAAA]">
                  {timeAgo} ago
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm px-4 py-1 w-24 bg-white rounded-full"
                  onClick={() => onAction && onAction("decline")}
                >
                  DECLINE
                </button>
                <button
                  className="text-sm px-4 py-1 w-24 bg-black text-white rounded-full"
                  onClick={() => onAction && onAction("accept")}
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`h-3 w-3 ${
                notif.isRead ? "bg-gray-400" : "bg-green-500"
              } rounded-full`}
            />
          </div>
        </div>
      );

    case "acceptedInvite":
      return (
        <div onClick={() => navigate(`/journal/${notif.contentId}`)} className="flex link-pointer items-center justify-between p-2 font-Inter bg-[#F2F0F0] rounded-xl">
          <div className="flex">
            <img
              className="w-10 h-10 rounded-full border-[3px] border-white"
              src={notif.pfp || "/default-pfp.png"}
              alt="User avatar"
              referrerPolicy="no-referrer"
            />
            <div className="ml-4 flex flex-col gap-2 text-left">
              <div className="text-sm  font-extralight">
                {"You accepted "}
                <span className="font-bold">{notif.sender}</span>
                {" invite for Journal "}
                <span className="font-bold">{notif.contentTitle}</span>
                <p className="text-xs text-left font-normal font-Inter text-[#AAAAAA]">
                  {timeAgo} ago
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`h-3 w-3 ${
                notif.isRead ? "bg-gray-400" : "bg-green-500"
              } rounded-full`}
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-between p-2 font-Inter bg-[#F2F0F0] rounded-xl">
          <div className="flex">
            <img
              className="w-10 h-10 rounded-full border-[3px] border-white"
              src={notif.pfp || "/default-pfp.png"}
              alt="User avatar"
              referrerPolicy="no-referrer"
            />
            <div className="ml-4 flex flex-col gap-2 text-left">
              <div className="text-sm font-extralight">
                <span className="font-bold">{notif.sender}</span>{" "}
                {notif.message}
                <p className="text-xs text-left font-normal font-Inter text-[#AAAAAA]">
                  {timeAgo} ago
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`h-3 w-3 ${
                notif.isRead ? "bg-gray-400" : "bg-green-500"
              } rounded-full`}
            />
          </div>
        </div>
      );
  }
};

export default NotificationItem;
