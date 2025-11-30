import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginFrom, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      return navigate("/");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      setError(error.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-1">
          {isLoginFrom ? "Sign in to DevTinder" : "Create Account"}
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          {isLoginFrom ? "Welcome back, developer!" : "Join the community today."}
        </p>

        <div className="flex flex-col gap-4">
          {!isLoginFrom && (
            <div className="flex gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered bg-slate-900 border-slate-600 text-white w-full focus:outline-none focus:border-emerald-500"
                placeholder="First Name"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered bg-slate-900 border-slate-600 text-white w-full focus:outline-none focus:border-emerald-500"
                placeholder="Last Name"
              />
            </div>
          )}
          
          <input
            type="text"
            value={emailId}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered bg-slate-900 border-slate-600 text-white w-full focus:outline-none focus:border-emerald-500"
            placeholder="Email Address"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered bg-slate-900 border-slate-600 text-white w-full focus:outline-none focus:border-emerald-500"
            placeholder="Password"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none w-full mt-2 normal-case text-lg"
            onClick={isLoginFrom ? handleLogin : handleSignUp}
          >
            {isLoginFrom ? "Login" : "Sign Up"}
          </button>

          <div className="text-center mt-4">
            <span
              className="text-slate-400 text-sm cursor-pointer hover:text-emerald-400 transition"
              onClick={() => { setIsLoginForm(!isLoginFrom); setError(""); }}
            >
              {isLoginFrom ? "New here? Create an account" : "Already have an account? Login"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
