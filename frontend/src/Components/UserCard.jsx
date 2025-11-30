// frontend/src/Components/UserCard.jsx
import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } = user;

  const displayPhoto = photoURL 
    ? photoURL 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${_id}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleSendRequest = async (status, userId) => {
    try {
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
    <div className="card w-full max-w-[22rem] bg-gray-800/60 backdrop-blur-md shadow-2xl hover:shadow-green-500/10 transition-all duration-300 rounded-[2rem] overflow-hidden border border-white/5 group">
      
      {/* 1. Image Area */}
      <figure className="relative h-80 w-full overflow-hidden">
        <img 
            src={displayPhoto} 
            alt={`${firstName} ${lastName}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* Floating Details */}
        <div className="absolute bottom-5 left-5 right-5 text-white z-10">
            <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-lg truncate">
                {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-3 mt-2">
                 {age && <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-gray-100">{age} YRS</span>}
                 {gender && <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-gray-100 capitalize">{gender}</span>}
            </div>
        </div>
      </figure>

      {/* 2. Content Area */}
      <div className="p-6 pt-4">
        
        {/* About Section */}
        <div className="min-h-[4rem] mb-4">
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {about || "Experienced developer looking to connect, share knowledge, and build amazing projects."}
            </p>
        </div>

        {/* Skills Tags */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs font-medium border border-gray-600/50">
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                  <span className="px-2 py-1 text-gray-500 text-xs font-bold">+{skills.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* 3. Action Buttons */}
        <div className="flex gap-4 pt-2">
            {/* Ignore */}
            <button
                onClick={() => handleSendRequest("ignored", _id)}
                className="flex-1 btn btn-outline btn-error h-12 rounded-2xl border-2 hover:bg-error hover:text-white transition-all duration-300 group/btn"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Interested */}
            <button
                onClick={() => handleSendRequest("intrested", _id)}
                className="flex-1 btn btn-success h-12 rounded-2xl text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 group/btn"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover/btn:-rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
