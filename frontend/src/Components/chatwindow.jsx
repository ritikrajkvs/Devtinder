// frontend/src/Components/ChatWindow.jsx
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

  // Effect for socket connection
  useEffect(() => {
    if (loggedInUser) {
      // Connect to the socket server, passing userId as a query parameter
      const newSocket = io("http://localhost:3000", {
        query: { userId: loggedInUser._id },
      });
      setSocket(newSocket);

      // Listen for incoming messages
      newSocket.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup on component unmount
      return () => newSocket.close();
    }
  }, [loggedInUser]);

  // Effect for fetching message history when selectedUser changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedUser) {
        try {
          const res = await axios.get(
            `${BASE_URL}/chat/history/${selectedUser._id}`,
            { withCredentials: true }
          );
          setMessages(res.data);
        } catch (err) {
          console.error("Failed to fetch chat history", err);
        }
      }
    };
    fetchHistory();
  }, [selectedUser]);

  // Auto-scroll to the latest message
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
    
    socket.emit("sendMessage", messagePayload);

    // Optimistically update our own UI
    setMessages((prevMessages) => [...prevMessages, messagePayload]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[70vh] bg-base-200 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        Chat with {selectedUser.firstName}
      </h2>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.senderId === loggedInUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;