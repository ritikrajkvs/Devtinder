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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
                {isLoginFrom ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
                {isLoginFrom ? "Login to find your perfect dev match" : "Join the community of developers"}
            </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 space-y-4">
          {!isLoginFrom && (
            <div className="flex gap-4">
              <label className="form-control w-full">
                <span className="label-text text-gray-300 font-semibold mb-1">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered bg-gray-900/50 border-gray-600 focus:border-green-500 text-white w-full rounded-xl"
                  placeholder="John"
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-gray-300 font-semibold mb-1">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered bg-gray-900/50 border-gray-600 focus:border-green-500 text-white w-full rounded-xl"
                  placeholder="Doe"
                />
              </label>
            </div>
          )}

          <label className="form-control w-full">
            <span className="label-text text-gray-300 font-semibold mb-1">Email Address</span>
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered bg-gray-900/50 border-gray-600 focus:border-green-500 text-white w-full rounded-xl"
              placeholder="developer@example.com"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text text-gray-300 font-semibold mb-1">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered bg-gray-900/50 border-gray-600 focus:border-green-500 text-white w-full rounded-xl"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg">{error}</p>}

          <div className="pt-4">
            <button
              className="btn btn-primary w-full text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-900/20"
              onClick={isLoginFrom ? handleLogin : handleSignUp}
            >
              {isLoginFrom ? "Login" : "Sign Up"}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-gray-400 text-sm">
              {isLoginFrom ? "Don't have an account? " : "Already have an account? "}
              <span
                className="text-green-400 cursor-pointer hover:underline font-semibold"
                onClick={() => {
                    setIsLoginForm(!isLoginFrom);
                    setError("");
                }}
              >
                {isLoginFrom ? "Sign up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
