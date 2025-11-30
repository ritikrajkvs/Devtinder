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

  const getFeed = async () => {
    // FIX: Check if feed exists AND has length to prevent crash
    if (feed && feed.length > 0) {
        setIsLoading(false);
        return;
    }

    try {
      // FIX: Added "/api" to match backend route
      const response = await axios.get(BASE_URL + "/api/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    getFeed();
  }, []); 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  // FIX: Safe check for empty feed handling null case
  if (!feed || feed.length === 0)
    return (
      <h1 className="flex justify-center mt-32 text-4xl font-extrabold text-gray-700 p-8 text-center">
        🎉 All caught up! No more developers in your feed.
      </h1>
    );
    
  return (
    <div className="flex flex-col items-center gap-6 my-8">
      {feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Feed;
