import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import usenavigate from React Router
import { auth } from "../firebaseConfig";

interface Friend {
  uid: string;
  pfp: string | null;
}

const FriendsSection: React.FC<{ friends: Friend[]; toShow?:number }> = (
  { friends , toShow = 4 }
) => {
  const navigate = useNavigate();
  const userUid = auth.currentUser?.uid;
  const [displayedFriends, setDisplayedFriends] = useState<any[]>([]);
  const extraFriends = friends.length - displayedFriends.length;
  const [moveFromIndex, setMoveFromIndex] = useState(-1);
  const [loadingState, setLoadingState] = useState<boolean[]>(
    new Array(displayedFriends.length).fill(true)
  );

  useEffect(() => {
    if (toShow === 4) {
      const handleResize = () => {
        if (window.innerWidth <= 1140) {
          setDisplayedFriends(friends.slice(0, 3));
        } else {
          setDisplayedFriends(friends.slice(0, 4));
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    } else {
      setDisplayedFriends(friends.slice(0, toShow)); // Set displayedFriends for any other value of toShow
    }
  }, [friends, toShow]);
  
  const handleImageLoad = (index: number) => {
    setLoadingState((prevState) => {
      const newLoadingState = [...prevState];
      newLoadingState[index] = false;
      return newLoadingState;
    });
  };

  const handleImageError = (index: number) => {
    console.error(`Error loading image for UID: ${friends[index]?.uid}`);
    setLoadingState((prevState) => {
      const newLoadingState = [...prevState];
      newLoadingState[index] = false;
      return newLoadingState;
    });
  };

  const handleFriendClick = (uid: string) => {
    if(uid!=userUid)
    navigate(`/user/${uid}`);
  };

  return (
    <div className="flex relative items-center justify-center h-14 w-[220px]">
      {displayedFriends.length === 0 ? (
        <div className="text-black font-semibold text-center">
          You have no friends.
        </div>
      ) : (
        <>
          {displayedFriends.map((friend, index) => (
            <div
              key={index}
              className={`absolute link-pointer size-14 transition-all z-${index} hover:z-20 duration-150 hover:size-16 rounded-full bg-gray-300 border-4 border-white`}
              onMouseEnter={() => setMoveFromIndex(index)}
              onMouseLeave={() => setMoveFromIndex(-1)}
              onClick={() => handleFriendClick(friend.uid)} // Handle click to navigate
              style={{
                left: `calc(${index * 35}px + ${
                  index >= moveFromIndex ? 12 : 0
                }px)`,
              }}
            >
              <img
                src={friend.pfp ?? "/user.png"}
                referrerPolicy="no-referrer"
                alt={`Friend ${index + 1}`}
                className="w-full h-full rounded-full object-cover"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)} // Handle loading error
              />
            </div>
          ))}

          {extraFriends > 0 && (
            <div
              className={`absolute size-14 link-pointer flex items-center transition-all duration-150 ease-in-out z-10 hover:size-16 
                justify-center rounded-full bg-gray-400 text-white text-sm font-bold border-4 border-white`}
              onMouseEnter={() => setMoveFromIndex(4)}
              onMouseLeave={() => setMoveFromIndex(-1)}
              style={{
                left: `calc(${displayedFriends.length * 35}px + ${
                  4 > moveFromIndex ? 12 : 12
                }px)`,
              }}
            >
              +{extraFriends}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FriendsSection;
