// frontend/src/Components/UserCard.jsx (UPDATED FOR ATTRACTIVENESS)
import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
// addRequests was unused, removed for cleaner code.

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } =
    user;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      // Remove the user from the feed array upon action
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    // Professional Card Styling: max-w-lg, shadow-2xl, border-t for an accent, and hover effects.
    <div className="card w-full max-w-lg bg-white shadow-2xl border-t-4 border-secondary transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 overflow-hidden rounded-xl">
      
      {/* Image Area: Fixed height, object-cover, and hover zoom for a sleek look */}
      <div className="p-0">
        <figure className="relative h-64 w-full overflow-hidden bg-gray-100">
            <img 
                src={photoURL} 
                alt={`${firstName} ${lastName}'s profile`} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy" // Performance improvement
            />
            {/* Subtle gradient overlay for better text contrast if text were overlaid */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
        </figure>
      </div>

      <div className="card-body p-6 sm:p-8">
        {/* Name and Details: Prominent title */}
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-4xl font-extrabold text-neutral-content leading-tight">
                {firstName} {lastName}
            </h2>
             {/* Age/Gender Badge: Clean, condensed display */}
            {(age || gender) && (
                <div className="badge badge-lg badge-primary text-white font-semibold text-base py-3 ml-4">
                    {age && <span>{age}</span>}
                    {age && gender && <span className="mx-1">|</span>}
                    {gender && <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>}
                </div>
            )}
        </div>
        
        {/* About section: Muted, italic text */}
        <p className="text-gray-600 mb-4 italic text-sm line-clamp-3">
            {about || "The developer has not provided a professional summary yet."}
        </p>

        {/* Skills Section: Attractive skill pills */}
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

        {/* Action Buttons: Clear distinction and emphasis on the primary action */}
        <div className="card-actions justify-center sm:justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            className="btn btn-lg btn-ghost text-error/80 hover:bg-error/10 hover:text-error min-w-[120px]" // Subtle Ignore
            onClick={() => {
              handleSendRequest("ignored", _id);
            }}
          >
            ❌ Ignore
          </button>
          <button
            className="btn btn-lg btn-secondary font-bold shadow-xl shadow-secondary/50 transition-all duration-200 hover:scale-[1.03] min-w-[120px]" // Strong Interested
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
