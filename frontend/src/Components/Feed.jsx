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
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Track if DB has more users

  const getFeed = async () => {
    // If we know there are no more users, stop trying
    if (!hasMore) {
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      
      const newUsers = response.data;
      
      if (newUsers.length === 0) {
        setHasMore(false); // Stop future fetches
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
    // 1. Initial Load: If feed is null
    // 2. Auto-Refill: If feed exists but is empty (user cleared it)
    if ((feed === null || feed.length === 0) && hasMore) {
      getFeed();
    } else {
      setIsLoading(false);
    }
  }, [feed, hasMore]); // Re-run whenever feed changes (e.g., gets empty)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  // Only show "All caught up" if we are SURE there is no more data
  if ((!feed || feed.length === 0) && !hasMore)
    return (
      <div className="flex flex-col items-center justify-center mt-32 p-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-4">
            🎉 All caught up!
        </h1>
        <p className="text-gray-500 text-lg">
            No more developers in your area right now.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6 my-8">
      {feed && feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Feed;
