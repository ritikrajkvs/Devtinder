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
    <div className="fixed top-0 left-0 w-full bg-slate-800 border-b border-slate-700 z-50 h-16 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-2xl">🔥</span>
          <span className="text-xl font-bold tracking-tight text-white">DevTinder</span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-slate-300 text-sm font-medium">
              Hello, {user.firstName}
            </span>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-slate-600"
              >
                <div className="w-9 rounded-full">
                  <img alt="Profile" src={user.photoURL} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-slate-800 border border-slate-700 rounded-lg shadow-xl mt-3 w-52 p-2 z-[100]"
              >
                <li>
                  <Link to="/profile" className="text-slate-200 hover:bg-slate-700 py-2">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="text-slate-200 hover:bg-slate-700 py-2">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="text-slate-200 hover:bg-slate-700 py-2">
                    Requests
                  </Link>
                </li>
                <div className="divider my-1 border-slate-700"></div>
                <li>
                  <button onClick={handleLogout} className="text-red-400 hover:bg-red-900/20 py-2">
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
