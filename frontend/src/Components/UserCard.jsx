// frontend/src/Components/UserCard.jsx
import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } = user;

  // Use DiceBear 'Avataaars' for a professional tech-startup look
  // It generates a consistent person-avatar based on their unique ID
  const displayPhoto = photoURL 
    ? photoURL 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${_id}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleSendRequest = async (status, userId) => {
    try {
      // "intrested" (typo) must be sent to backend, but we show "Interested" on UI
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="card w-full max-w-[24rem] bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden border border-gray-100 group">
      
      {/* 1. Image Area - Modern Full Height with Gradient */}
      <figure className="relative h-72 w-full bg-gray-50">
        <img 
            src={displayPhoto} 
            alt={`${firstName} ${lastName}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Floating Name & Details */}
        <div className="absolute bottom-4 left-5 text-white">
            <h2 className="text-3xl font-extrabold drop-shadow-md">
                {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm font-medium opacity-90">
                 {age && <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">{age} yrs</span>}
                 {gender && <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md capitalize">{gender}</span>}
            </div>
        </div>
      </figure>

      {/* 2. Content Area */}
      <div className="card-body p-5">
        
        {/* About Section */}
        <div className="min-h-[3.5rem]">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {about || "Experienced developer looking to connect, share knowledge, and build amazing projects."}
            </p>
        </div>

        {/* Skills Tags */}
        {skills && skills.length > 0 && (
          <div className="mt-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                  <span className="px-2 py-1 text-gray-400 text-xs font-bold">+{skills.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* 3. Action Buttons - Professional & Labeled */}
        <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-100">
            
            {/* Ignore Button */}
            <button
                onClick={() => handleSendRequest("ignored", _id)}
                className="flex-1 btn btn-outline border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 hover:text-red-500 transition-all duration-200 gap-2 h-12 rounded-xl normal-case text-base font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Ignored
            </button>

            {/* Interested Button */}
            <button
                onClick={() => handleSendRequest("intrested", _id)} // Sends 'intrested' to DB
                className="flex-1 btn bg-secondary text-white border-none hover:bg-secondary-focus hover:shadow-lg transition-all duration-200 gap-2 h-12 rounded-xl normal-case text-base font-bold"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Interested
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
