import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl supports-[backdrop-filter]:bg-[#0f172a]/60">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Custom Animated Logo Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-primary to-secondary rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-6 h-6 text-white stroke-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white font-sans">
              Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tinder</span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Connect & Code</span>
          </div>
        </Link>

        {/* User Section */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Signed in as (Username) */}
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs text-gray-400">Signed in as</span>
              <span className="text-sm font-bold text-white tracking-wide">
                {user.firstName}
              </span>
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar ring-2 ring-primary/50 ring-offset-2 ring-offset-[#0f172a] hover:ring-primary transition-all duration-300"
              >
                <div className="w-10 rounded-full overflow-hidden">
                  <img alt="User" src={user.photoURL} className="object-cover w-full h-full" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-4 w-60 p-2 shadow-2xl bg-[#1e293b] border border-white/5 rounded-2xl text-gray-300 z-[1]"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                   <p className="font-bold text-white">My Account</p>
                   <p className="text-xs text-gray-500 truncate" title={user.emailId}>
                      {user.emailId || "user@devtinder.com"}
                   </p>
                </div>
                <li>
                  <Link to="/profile" className="py-3 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="py-3 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Connections 
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="py-3 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    Requests
                    <span className="badge badge-error badge-xs ml-auto animate-pulse"></span>
                  </Link>
                </li>
                <div className="divider my-1 border-white/5"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
