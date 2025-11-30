// frontend/src/Components/Feed.jsx (UPDATED FOR PERFORMANCE AND UX)
import axios from "axios";
import React, { useEffect, useState } from "react"; // <--- Import useState
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  // Initialize loading state to true until the first fetch attempt completes
  const [isLoading, setIsLoading] = useState(true); 

  const getFeed = async () => {
    // Prevent fetching if data already exists
    if (feed.length > 0) {
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false); // Set loading to false after the API call finishes (success or error)
    }
  };

  useEffect(() => {
    getFeed();
    // CRITICAL FIX: Empty dependency array [] ensures this runs only ONCE on component mount.
  }, []); 

  // Render a professional loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        {/* Using a professional DaisyUI loading spinner */}
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  // Render 'No more users' message
  if (feed.length === 0)
    return (
      <h1 className="flex justify-center mt-32 text-4xl font-extrabold text-gray-700 p-8 text-center">
        🎉 All caught up! No more developers in your feed.
      </h1>
    );
    
  // Render the feed
  return (
    <div className="flex flex-col items-center gap-6 my-8">
      {feed.map((user) => (
        // The key prop is important for React's efficiency
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Feed;
