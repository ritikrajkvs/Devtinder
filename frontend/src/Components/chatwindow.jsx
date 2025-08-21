// File: frontend/src/Components/ChatWindow.jsx
// Description: Correctly handles socket events and filters messages by re-establishing listeners.

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatWindow = ({ selectedUser }) => {
  const loggedInUser = useSelector((store) => store.user);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // CORRECTED EFFECT: This hook now manages both the socket connection and its event listeners together.
  useEffect(() => {
    // Only proceed if we have both the logged-in user and a selected user to chat with.
    if (loggedInUser?._id && selectedUser?._id) {
      // Establish a new socket connection.
      const newSocket = io("http://localhost:3000", {
        query: { userId: loggedInUser._id },
      });
      setSocket(newSocket);

      // Set up the listener for incoming 'newMessage' events.
      newSocket.on("newMessage", (incomingMessage) => {
        // This is the crucial filter: only add the new message to the state if it's from
        // the user we are currently chatting with. This prevents messages from other
        // conversations from appearing in the wrong window.
        if (incomingMessage.senderId === selectedUser._id) {
          setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        }
      });

      // Cleanup function: This is essential. It runs when the component unmounts OR
      // when the `selectedUser` changes. It closes the old socket connection before a new one
      // is made, which prevents memory leaks and duplicate, conflicting event listeners.
      return () => newSocket.close();
    }
  }, [loggedInUser, selectedUser]); // DEPENDENCY FIX: By adding `selectedUser`, this effect re-runs
                                     // every time you click on a different connection.

  // This effect fetches the historical chat messages when a new user is selected.
  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedUser?._id) {
        try {
          const res = await axios.get(
            `${BASE_URL}/chat/history/${selectedUser._id}`,
            { withCredentials: true }
          );
          setMessages(res.data);
        } catch (err) {
          console.error("Failed to fetch chat history", err);
          setMessages([]); // Clear previous messages in case of an error
        }
      }
    };
    fetchHistory();
  }, [selectedUser]);

  // This effect automatically scrolls the chat window to the bottom when new messages are added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socket) return;

    const messagePayload = {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message: newMessage,
    };
    
    // Send the message to the server via the socket.
    socket.emit("sendMessage", messagePayload);

    // Optimistically update the sender's UI immediately for a responsive feel.
    setMessages((prevMessages) => [...prevMessages, { ...messagePayload, createdAt: new Date().toISOString() }]);
    setNewMessage("");
  };

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-[75vh] bg-base-300 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2 text-white">
        Chat with {selectedUser.firstName} {selectedUser.lastName}
      </h2>
      
      <div className="flex-grow overflow-y-auto mb-4 p-2">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`chat ${
              msg.senderId === loggedInUser?._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className={`chat-bubble ${
              msg.senderId === loggedInUser?._id ? "chat-bubble-primary" : "chat-bubble-secondary"
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered w-full"
          aria-label="Chat message input"
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
