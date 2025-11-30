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

  // All Caught Up View
  if ((!feed || feed.length === 0) && !hasMore) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="relative bg-[#1e293b] p-6 rounded-full border border-white/10 shadow-2xl mb-8">
            <span className="text-6xl">🎉</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          You're all caught up!
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          You've explored all available profiles for now. Check back later for more amazing developers.
        </p>
        
        <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold border border-white/10 transition-all"
        >
            Refresh Feed
        </button>
      </div>
    );
  }

  // Loading View
  if (isLoading && (!feed || feed.length === 0)) {
    return (
        <div className="flex justify-center items-center h-[70vh]">
            <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 my-10 px-4 w-full max-w-4xl mx-auto">
      {/* Feed Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-200">Suggested Developers</h2>
        <div className="h-1 w-20 bg-primary mx-auto mt-2 rounded-full"></div>
      </div>

      {feed && feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
      
      {isLoading && feed && feed.length > 0 && (
         <div className="flex items-center gap-3 text-gray-500 font-medium animate-pulse mt-8 bg-[#1e293b] px-6 py-3 rounded-full border border-white/5">
            <span className="loading loading-spinner loading-sm text-primary"></span>
            Finding more matches...
         </div>
      )}
    </div>
  );
};

export default Feed;
