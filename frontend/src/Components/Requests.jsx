import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

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
      dispatch(addRequests(response.data.data));
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return (
     <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
     </div>
  );

  if (requests.length === 0) return (
     <div className="flex flex-col items-center justify-center mt-20 p-8 text-center animate-fade-in">
        <div className="text-6xl mb-4 opacity-50">📭</div>
        <h2 className="text-2xl font-bold text-white mb-2">No pending requests</h2>
        <p className="text-gray-400">You're all caught up!</p>
     </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-black text-white mb-8">Connection Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoURL, about, age, gender } = request.fromUserId;

          return (
            <div 
                key={request._id} 
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#1e293b]/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl transition-all hover:bg-[#1e293b]/80"
            >
              <div className="w-20 h-20 shrink-0">
                 <img 
                    alt={firstName} 
                    src={photoURL} 
                    className="w-full h-full object-cover rounded-full border-2 border-white/10"
                 />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">
                  {firstName} {lastName}
                  {age && <span className="ml-2 text-sm font-normal text-gray-400">• {age}</span>}
                </h2>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{about || "A fellow developer wants to connect."}</p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  className="flex-1 sm:flex-none btn bg-red-500/10 text-red-400 border-0 hover:bg-red-500 hover:text-white rounded-xl"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="flex-1 sm:flex-none btn bg-green-500 text-white border-0 hover:bg-green-600 rounded-xl font-bold shadow-lg shadow-green-500/20"
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
