// File: frontend/src/Components/Connections.jsx
// Description: Updated to show a list of connections and the chat window.

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection, removeConnection } from "../utils/connectionSlice";
import ChatWindow from "./ChatWindow"; // Import the new ChatWindow component

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const fetchConnections = async () => {
    try {
      // Clear previous connections to avoid duplicates on re-fetch
      dispatch(removeConnection());
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.log("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    // Fetch connections when the component mounts
    fetchConnections();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display a loading state while connections are being fetched
  if (!connections) {
    return <div className="text-center my-10">Loading connections...</div>;
  }

  // Display a message if the user has no connections
  if (connections.length === 0) {
    return (
      <h1 className="flex justify-center text-2xl my-10 text-green-300">
        No connections found. Go make some friends!
      </h1>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 my-10 max-w-6xl mx-auto px-4">
      {/* Connections List Column */}
      <div className="w-full md:w-1/3 bg-base-300 p-4 rounded-lg shadow-lg">
        <h1 className="font-bold text-2xl text-pink-400 mb-4 border-b border-gray-600 pb-2">
          Connections ({connections.length})
        </h1>
        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoURL, about } = connection;
            // Determine if the current connection is the one selected for chat
            const isSelected = selectedChatUser?._id === _id;

            return (
              <div
                key={_id}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                }`}
                onClick={() => setSelectedChatUser(connection)}
              >
                <div className="avatar mr-4">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={photoURL} alt={`${firstName} ${lastName}'s profile`} />
                    </div>
                </div>
                <div>
                  <h2 className="font-bold">{firstName} {lastName}</h2>
                  <p className="text-sm opacity-70 truncate">{about || "No bio available."}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window Column */}
      <div className="w-full md:w-2/3">
        {selectedChatUser ? (
          <ChatWindow selectedUser={selectedChatUser} />
        ) : (
          <div className="flex items-center justify-center h-full bg-base-300 rounded-lg shadow-lg">
            <p className="text-xl text-gray-500">Select a connection to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
