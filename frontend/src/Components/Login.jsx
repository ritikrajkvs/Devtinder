import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>

      <div className="flex w-full max-w-5xl h-[85vh] bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 m-4">
        
        {/* Left Side - Hero/Visual */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative p-12 bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
             <div className="relative z-10 text-center">
                 <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                    Code. Connect.<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Create.</span>
                 </h1>
                 <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                    Join the premier community for developers to find partners, mentors, and friends.
                 </p>
             </div>
             {/* Abstract Grid Visual */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 py-12 bg-black/20">
          <div className="w-full max-w-md mx-auto">
             <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-400">
                    {isLogin ? "Enter your credentials to access your account." : "Fill in your details to get started."}
                </p>
             </div>

            <div className="space-y-5">
              {!isLogin && (
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Email Address</label>
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-12"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

              <button
                onClick={isLogin ? handleLogin : handleSignup}
                className="btn btn-block h-14 bg-gradient-to-r from-primary to-secondary border-0 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform duration-200 mt-4"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                {isLogin ? "New to DevTinder?" : "Already have an account?"}{" "}
                <span
                  className="text-primary font-bold cursor-pointer hover:underline underline-offset-4"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                >
                  {isLogin ? "Sign up now" : "Login here"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
