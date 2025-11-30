// frontend/src/Components/Feed.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getFeed = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      const newUsers = response.data;
      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
        dispatch(addFeed(newUsers));
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((!feed || feed.length === 0) && hasMore) {
      getFeed();
    }
  }, [feed, hasMore]);

  if ((!feed || feed.length === 0) && !hasMore) {
    return (
      <div className="flex flex-col items-center justify-center mt-32 p-8 text-center animate-fade-in text-gray-300">
        <div className="text-7xl mb-6 drop-shadow-lg">🎉</div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
            You're all caught up!
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
            You've explored all available profiles. Check back later for new developers joining the community!
        </p>
      </div>
    );
  }

  if (isLoading && (!feed || feed.length === 0)) {
    return (
        <div className="flex justify-center items-center h-[60vh]">
            <span className="loading loading-ring loading-lg text-green-500"></span>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 my-10 px-4 w-full">
      {feed && feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
      
      {isLoading && feed && feed.length > 0 && (
         <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold animate-pulse mt-4">
            <span className="loading loading-spinner loading-xs"></span>
            Loading more developers...
         </div>
      )}
    </div>
  );
};

export default Feed;
