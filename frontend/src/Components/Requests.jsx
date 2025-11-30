import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
        console.error("Error reviewing request:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      // Safety check: Backend might return array directly or wrapped in { data: ... }
      const data = response?.data?.data || response?.data || [];
      dispatch(addRequests(data));
    } catch (err) {
        console.error("Error fetching requests:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return (
     <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-infinity loading-lg text-secondary scale-150"></span>
     </div>
  );

  if (!requests || requests.length === 0) return (
     <div className="flex flex-col items-center justify-center mt-20 p-8 text-center animate-fade-in min-h-[50vh]">
        <div className="relative mb-6">
            <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative text-6xl">📭</div>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">No pending requests</h2>
        <p className="text-gray-400 text-lg">You're all caught up! Check back later.</p>
     </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
         <h1 className="text-3xl font-black text-white tracking-tight">Connection Requests</h1>
         <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-bold text-sm border border-secondary/20">
            {requests.length}
         </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoURL, about, age, gender } = request.fromUserId;

          return (
            <div 
                key={request._id} 
                className="group flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#1e293b]/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-[#1e293b]/60"
            >
              {/* Image */}
              <div className="relative w-20 h-20 shrink-0">
                 <img 
                    alt={firstName} 
                    src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${_id}`} 
                    className="w-full h-full object-cover rounded-2xl border-2 border-white/10 group-hover:border-secondary transition-colors"
                 />
              </div>
              
              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  {firstName} {lastName}
                  <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-gray-400 border border-white/5 font-normal uppercase tracking-wide">
                    {age} • {gender}
                  </span>
                </h2>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {about || "A fellow developer wants to connect with you."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  className="flex-1 sm:flex-none btn h-12 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition-all duration-300"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="flex-1 sm:flex-none btn h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 rounded-xl font-bold transition-all duration-300"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
