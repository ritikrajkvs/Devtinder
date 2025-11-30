import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="min-h-screen bg-[#0f172a] flex justify-center py-10 px-4 animate-fade-in">
       {user && <EditProfile user={user} />}
    </div>
  );
};

export default Profile;
