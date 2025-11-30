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
    // Glassmorphism Header
    <div className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="navbar container mx-auto px-4 sm:px-6 py-2">
        {/* Logo Section */}
        <div className="flex-1">
          <Link 
            to="/" 
            className="btn btn-ghost text-2xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            DevTinder <span className="text-2xl">🔥</span>
          </Link>
        </div>

        {/* User Section */}
        {user && (
          <div className="flex-none gap-4 flex items-center">
            {/* Welcome Message (Hidden on small screens) */}
            <div className="hidden md:block text-gray-300 font-medium text-sm">
              Welcome back, <span className="text-green-400 font-bold">{user.firstName}</span>!
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar ring ring-green-500 ring-offset-base-100 ring-offset-2 hover:ring-green-400 transition-all"
              >
                <div className="w-10 rounded-full">
                  <img alt="User Photo" src={user.photoURL} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl mt-4 w-52 p-2 z-[1]"
              >
                <li className="mb-1">
                  <Link to="/profile" className="justify-between py-3 hover:bg-gray-800 rounded-lg text-gray-200">
                    Profile <span className="badge badge-accent badge-sm">New</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link to="/connections" className="justify-between py-3 hover:bg-gray-800 rounded-lg text-gray-200">
                    Connections <span className="badge badge-secondary badge-sm">💗</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link to="/requests" className="justify-between py-3 hover:bg-gray-800 rounded-lg text-gray-200">
                    Requests <span className="badge badge-warning badge-sm">👁️</span>
                  </Link>
                </li>
                <div className="divider my-0 border-gray-700"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 py-3 rounded-lg font-semibold"
                  >
                    Logout
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
