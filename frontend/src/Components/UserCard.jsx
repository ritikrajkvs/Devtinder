// frontend/src/Components/UserCard.jsx
import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } = user;

  // Generate a random, consistent avatar if photoURL is missing
  // 'robohash' creates unique robots/monsters based on the text seed (user ID)
  // Options: set=set4 (kittens), set=set2 (monsters), default (robots)
  const displayPhoto = photoURL 
    ? photoURL 
    : `https://robohash.org/${_id}?set=set4&bgset=bg2&size=400x400`; 

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
    <div className="card w-full max-w-[22rem] sm:max-w-[26rem] bg-base-100 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group border border-gray-100">
      
      {/* Image Container with Gradient Overlay */}
      <figure className="relative h-80 w-full overflow-hidden">
        <img 
            src={displayPhoto} 
            alt="Profile" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
        />
        {/* Dark Gradient at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
        
        {/* Name & Age Overlay */}
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-md">
                {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1 opacity-90 text-sm font-medium">
                 {age && <span className="badge badge-accent badge-sm font-bold text-xs">{age}</span>}
                 {gender && <span className="capitalize tracking-wider">{gender}</span>}
            </div>
        </div>
      </figure>

      <div className="card-body p-6 bg-white relative">
        {/* About Section */}
        <div className="min-h-[3rem]">
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 italic">
                {about || "Hey there! I'm using DevTinder to connect with fellow developers."}
            </p>
        </div>

        {/* Skills - Modern Pill Design */}
        {skills && skills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold tracking-wide border border-gray-200">
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                  <span className="px-2 py-1 text-gray-400 text-xs font-bold">+{skills.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-2">
            
            {/* Ignore Button */}
            <button
                onClick={() => handleSendRequest("ignored", _id)}
                className="btn btn-circle btn-lg bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 hover:scale-110 transition-all duration-300 shadow-sm"
                title="Ignore"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Connect Button */}
            <button
                onClick={() => handleSendRequest("intrested", _id)}
                className="btn btn-circle btn-lg bg-gradient-to-tr from-green-400 to-green-600 text-white border-none hover:shadow-lg hover:shadow-green-400/40 hover:scale-110 transition-all duration-300"
                title="Connect"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
