import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } = user;

  // Fallback image logic
  const displayPhoto = photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${_id}`;

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
    <div className="relative w-full max-w-[24rem] mx-auto perspective-1000 my-4">
      <div className="relative group bg-[#1e293b] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:-translate-y-2">
        
        {/* --- 1. Immersive Image Header --- */}
        <div className="relative h-[28rem] w-full overflow-hidden">
            {/* Main Image with Zoom Effect */}
            <img 
                src={displayPhoto} 
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}
            />
            
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent opacity-90"></div>

            {/* Top Badge: Online/Open to Work */}
            <div className="absolute top-6 right-6">
                <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">Available</span>
                </div>
            </div>

            {/* Name & Basic Info Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-[#0f172a] to-transparent">
                 <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-lg mb-2 leading-none">
                    {firstName} <span className="text-primary font-thin">{lastName}</span>
                 </h2>
                 <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                    {age && (
                        <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                            {age} years
                        </span>
                    )}
                    {gender && (
                        <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm capitalize">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            {gender}
                        </span>
                    )}
                 </div>
            </div>
        </div>

        {/* --- 2. Body Content & Skills --- */}
        <div className="px-6 pb-6 bg-[#0f172a] -mt-4 relative z-10 rounded-t-[2.5rem] border-t border-white/5">
            
            {/* Highlighted Skills (Floating Interaction) */}
            <div className="relative -top-5 mb-1">
                <div className="flex flex-wrap gap-2 justify-start">
                    {skills && skills.map((skill, index) => (
                        <span 
                            key={index}
                            className="px-4 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg shadow-primary/25 border border-white/10 hover:scale-105 transition-transform cursor-default uppercase tracking-wide"
                        >
                            {skill}
                        </span>
                    ))}
                    {!skills?.length && (
                        <span className="px-4 py-1.5 text-[11px] font-bold text-gray-400 bg-gray-800 rounded-full border border-white/5">
                            EXPLORER
                        </span>
                    )}
                </div>
            </div>

            {/* Bio Section */}
            <div className="mb-8 mt-2">
                 <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">
                    {about || "This developer prefers to let their code do the talking. Connect to find out more about their projects and passion!"}
                 </p>
            </div>

            {/* --- 3. Action Buttons --- */}
            <div className="grid grid-cols-5 gap-4 items-center">
                {/* Pass Button (Small) */}
                <div className="col-span-2">
                    <button
                        onClick={() => handleSendRequest("ignored", _id)}
                        className="w-full group/btn relative overflow-hidden btn h-14 bg-[#1e293b] hover:bg-red-500/10 border border-white/5 hover:border-red-500/50 text-gray-400 hover:text-red-500 rounded-2xl transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover/btn:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                    </button>
                </div>

                {/* Connect Button (Large & Highlighted) */}
                <div className="col-span-3">
                    <button
                        onClick={() => handleSendRequest("intrested", _id)}
                        className="w-full group/btn relative overflow-hidden btn h-14 bg-white text-black border-0 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/50 rounded-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 transition-opacity group-hover/btn:opacity-90"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2 font-black text-sm text-white tracking-wider">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            Interested
                        </span>
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default UserCard;
