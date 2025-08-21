// frontend/src/Components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatWindow = ({ selectedUser }) => {
  const loggedInUser = useSelector((store) => store.user);
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Create socket when user logs in / selectedUser changes.
  useEffect(() => {
    if (!loggedInUser?._id) return;

    // Close old socket if exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Connect socket with userId in query
    const s = io("http://localhost:3000", {
      query: { userId: loggedInUser._id },
      transports: ["websocket"],
    });
    socketRef.current = s;

    s.on("connect", () => {
      console.log("Socket connected", s.id);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });

    // Generic listener for incoming messages
    s.on("newMessage", (incomingMessage) => {
      try {
        const incomingSender = String(incomingMessage.senderId);
        const incomingReceiver = String(incomingMessage.receiverId);
        const me = String(loggedInUser._id);
        const other = String(selectedUser?._id);

        // Only append messages that belong to this conversation
        if (
          (incomingSender === me && incomingReceiver === other) ||
          (incomingSender === other && incomingReceiver === me)
        ) {
          setMessages((prev) => {
            // avoid duplicates (if message already present by _id)
            if (
              incomingMessage._id &&
              prev.some((m) => String(m._id) === String(incomingMessage._id))
            ) {
              return prev;
            }
            return [...prev, incomingMessage];
          });
        }
      } catch (e) {
        console.error("Error handling incoming message:", e);
      }
    });

    // update online users (optional)
    s.on("getOnlineUsers", (list) => {
      console.log("Online users:", list);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [loggedInUser, selectedUser]);

  // Fetch chat history for selected user
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedUser?._id || !loggedInUser?._id) return;
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/history/${selectedUser._id}`,
          { withCredentials: true }
        );
        // Normalize: ensure ids are strings
        const normalized = res.data.map((m) => ({
          ...m,
          senderId: String(m.senderId),
          receiverId: String(m.receiverId),
        }));
        setMessages(normalized);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
        setMessages([]);
      }
    };
    fetchHistory();
  }, [selectedUser, loggedInUser]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socketRef.current || !selectedUser?._id) return;

    const messagePayload = {
      senderId: String(loggedInUser._id),
      receiverId: String(selectedUser._id),
      message: newMessage.trim(),
    };

    // Use ack to learn whether server saved it. Server will also emit 'newMessage' back.
    socketRef.current.emit("sendMessage", messagePayload, (ack) => {
      if (!ack) {
        console.error("No acknowledgement from server");
      } else if (!ack.ok) {
        console.error("Send failed:", ack.error);
        // Optional: notify user
      } else {
        // Server will emit 'newMessage' to both sides; we don't push it locally here
      }
    });

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
              String(msg.senderId) === String(loggedInUser?._id) ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble ${
                String(msg.senderId) === String(loggedInUser?._id)
                  ? "chat-bubble-primary"
                  : "chat-bubble-secondary"
              }`}
            >
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
