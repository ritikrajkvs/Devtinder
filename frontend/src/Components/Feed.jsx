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
  const [isLoading, setIsLoading] = useState(false); // Start false to rely on logic
  const [hasMore, setHasMore] = useState(true); // Tracks if DB has more users

  const getFeed = async () => {
    // If we've already determined there's no more data, stop.
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      const newUsers = response.data;
      
      // If the backend sends an empty array, it means we ran out of users.
      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
        // Add new users to the store
        dispatch(addFeed(newUsers));
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Trigger fetch if:
    // 1. Feed is null (initial load)
    // 2. Feed is empty (user swiped all cards) AND we believe there's more data
    if ((!feed || feed.length === 0) && hasMore) {
      getFeed();
    }
  }, [feed, hasMore]); // Re-run whenever feed changes

  // Show "All Caught Up" ONLY if feed is empty AND we know there's no more data
  if ((!feed || feed.length === 0) && !hasMore) {
    return (
      <div className="flex flex-col items-center justify-center mt-32 p-8 text-center animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            All caught up!
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
            You've rated all available developers. Check back later for new joins!
        </p>
      </div>
    );
  }

  // Show Loading Spinner if loading AND we have no cards to show
  if (isLoading && (!feed || feed.length === 0)) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <span className="loading loading-spinner loading-lg text-secondary"></span>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 my-8 px-4">
      {feed && feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
      
      {/* Small loader at bottom if we are fetching more in background */}
      {isLoading && feed && feed.length > 0 && (
         <div className="text-gray-400 text-sm font-semibold animate-pulse mt-4">
            Loading more developers...
         </div>
      )}
    </div>
  );
};

export default Feed;
