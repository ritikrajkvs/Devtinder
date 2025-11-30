// frontend/src/Components/UserCard.jsx
import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } =
    user;

  const handleSendRequest = async (status, userId) => {
    try {
      // FIX: Added "/api" to match backend route
      await axios.post(
        BASE_URL + "/api/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="card w-full max-w-lg bg-white shadow-2xl border-t-4 border-secondary transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 overflow-hidden rounded-xl">
      
      <div className="p-0">
        <figure className="relative h-64 w-full overflow-hidden bg-gray-100">
            <img 
                src={photoURL} 
                alt={`${firstName} ${lastName}'s profile`} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
        </figure>
      </div>

      <div className="card-body p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-4xl font-extrabold text-neutral-content leading-tight">
                {firstName} {lastName}
            </h2>
            {(age || gender) && (
                <div className="badge badge-lg badge-primary text-white font-semibold text-base py-3 ml-4">
                    {age && <span>{age}</span>}
                    {age && gender && <span className="mx-1">|</span>}
                    {gender && <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>}
                </div>
            )}
        </div>
        
        <p className="text-gray-600 mb-4 italic text-sm line-clamp-3">
            {about || "The developer has not provided a professional summary yet."}
        </p>

        {skills && skills.length > 0 && (
          <div className="mt-2">
            <h3 className="font-bold text-lg mb-3 text-secondary">Key Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-lg badge-outline badge-secondary font-medium text-sm px-3 py-1.5"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card-actions justify-center sm:justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            className="btn btn-lg btn-ghost text-error/80 hover:bg-error/10 hover:text-error min-w-[120px]" 
            onClick={() => {
              handleSendRequest("ignored", _id);
            }}
          >
            ❌ Ignore
          </button>
          <button
            className="btn btn-lg btn-secondary font-bold shadow-xl shadow-secondary/50 transition-all duration-200 hover:scale-[1.03] min-w-[120px]" 
            onClick={() => {
              handleSendRequest("intrested", _id);
            }}
          >
            Connect 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
