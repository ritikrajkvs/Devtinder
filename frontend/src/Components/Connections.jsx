import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      // Safety check: Backend might return array directly or wrapped in { data: ... }
      const data = response?.data?.data || response?.data || [];
      dispatch(addConnections(data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
    </div>
  );

  if (!connections || connections.length === 0) return (
     <div className="flex flex-col items-center justify-center mt-20 p-8 text-center animate-fade-in min-h-[50vh]">
        <div className="relative mb-6">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative text-6xl">👥</div>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">No connections yet</h2>
        <p className="text-gray-400 mb-8 text-lg max-w-sm">Start swiping on the feed to find your perfect developer match!</p>
        <Link to="/" className="btn btn-primary btn-lg text-white rounded-2xl px-10 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            Explore Feed
        </Link>
     </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Your Connections</h1>
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm border border-primary/20">
            {connections.length}
          </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoURL, about, skills } = connection;
          return (
            <div 
                key={_id} 
                className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-[#1e293b]/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-primary/30 hover:bg-[#1e293b]/60 transition-all duration-300 shadow-xl"
            >
              {/* Avatar Section */}
              <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors duration-300 shadow-lg">
                    <img 
                        src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${_id}`} 
                        alt={firstName} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0f172a]"></div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left space-y-2">
                 <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {firstName} {lastName}
                 </h2>
                 <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 max-w-xl mx-auto md:mx-0">
                    {about || "Experienced developer ready to connect."}
                 </p>
                 
                 {skills && skills.length > 0 && (
                     <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
                        {skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-black/20 text-gray-400 px-3 py-1 rounded-lg border border-white/5">
                                {skill}
                            </span>
                        ))}
                        {skills.length > 4 && (
                            <span className="text-[10px] font-bold text-gray-500 py-1">+ {skills.length - 4}</span>
                        )}
                     </div>
                 )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                  <Link 
                    to={"/chat/" + _id} 
                    className="flex-1 md:flex-none btn btn-primary h-12 px-8 rounded-xl font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                  >
                    Chat
                  </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
