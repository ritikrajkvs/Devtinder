import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills ? user.skills.join(", ") : ""); 
  const [photo, setPhoto] = useState(null); // New state for file upload
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const handleSaveProfile = async () => {
    setError("");
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("about", about);
      formData.append("skills", skills); // Backend splits this string
      
      // Only append photo if a new file is selected
      if (photo) {
        formData.append("photo", photo);
      }

      const res = await axios.post(
        BASE_URL + "/profile/edit",
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoURL(URL.createObjectURL(file)); // Update preview
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* 1. Edit Form Section */}
      <div className="flex-1">
          <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-gray-400 text-sm mb-8">Update your personal details and developer stack.</p>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">First Name</label>
                        <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white rounded-xl h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Last Name</label>
                        <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white rounded-xl h-12"
                        />
                    </div>
                </div>

                {/* Updated Photo Section */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Profile Photo</label>
                    <div className="flex items-center gap-4">
                        <div className="avatar">
                            <div className="w-12 h-12 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={photoURL} alt="Preview" className="object-cover" />
                            </div>
                        </div>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-primary w-full bg-[#0f172a] border-gray-700 text-white rounded-xl h-12"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Age</label>
                        <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white rounded-xl h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="select select-bordered w-full bg-[#0f172a] border-gray-700 text-white rounded-xl h-12"
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">About</label>
                    <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="textarea textarea-bordered w-full bg-[#0f172a] border-gray-700 text-white rounded-xl min-h-[120px] leading-relaxed"
                    placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-1">Skills (Comma Separated)</label>
                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white rounded-xl h-12"
                        placeholder="JavaScript, React, Node.js..."
                    />
                </div>

                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                
                <div className="pt-4">
                    <button
                        onClick={handleSaveProfile}
                        className="btn btn-primary w-full h-14 rounded-2xl text-white font-bold text-lg shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
          </div>
      </div>

      {/* 2. Live Preview Section */}
      <div className="hidden lg:block w-[400px]">
         <div className="sticky top-28">
            <h3 className="text-gray-400 font-semibold mb-4 text-center text-sm uppercase tracking-widest">Live Preview</h3>
            <UserCard
            user={{ firstName, lastName, photoURL, age, gender, about, skills: skills.split(",").map(s => s.trim()).filter(s => s) }}
            />
         </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success bg-green-500 text-white border-none shadow-lg rounded-xl">
            <span className="font-semibold">Profile updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
