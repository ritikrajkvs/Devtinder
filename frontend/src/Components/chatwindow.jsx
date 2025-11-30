// File: frontend/src/Components/ChatWindow.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatWindow = ({ selectedUser }) => {
  const loggedInUser = useSelector((store) => store.user);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // State for Code Editor Modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");

  // FIXED: Robust Profile Image Handling
  const getProfileImage = (user) => {
    // If user exists and has a valid photoUrl, use it.
    if (user && user.photoUrl) return user.photoUrl;
    // Otherwise, return a reliable default avatar.
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  };

  // Helper: Handle image load errors by reverting to default
  const handleImageError = (e) => {
    e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  };

  // Helper: Format Code Snippet for Display
  const cleanCodeSnippet = (text) => {
    return text.replace(/^```|```$/g, "").trim();
  };

  // SOCKET CONNECTION
  useEffect(() => {
    if (!loggedInUser?._id || !selectedUser?._id) return;

    const newSocket = io("https://devtinder-8i1r.onrender.com", {
      query: { userId: loggedInUser._id },
    });

    setSocket(newSocket);

    newSocket.on("newMessage", (incoming) => {
      if (incoming.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, incoming]);
      }
    });

    return () => newSocket.disconnect();
  }, [loggedInUser, selectedUser]);

  // FETCH HISTORY
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedUser?._id) return;

      // Reset messages but DO NOT scroll (User Requirement)
      setMessages([]); 

      try {
        const res = await axios.get(
          `${BASE_URL}/chat/history/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("History Error:", err);
      }
    };

    fetchHistory();
  }, [selectedUser]);

  // SEND MESSAGE (Standard Text)
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const payload = {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message: newMessage,
    };

    sendMessageSocket(payload);
    setNewMessage("");
  };

  // SEND CODE (From Modal)
  const handleSendCode = () => {
    if (!codeSnippet.trim() || !socket) return;

    // Wrap in markdown code block
    const formattedMessage = "```" + codeSnippet + "```";

    const payload = {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message: formattedMessage,
    };

    sendMessageSocket(payload);
    setCodeSnippet("");
    setIsCodeModalOpen(false); 
  };

  // Shared Socket Emitter
  const sendMessageSocket = (payload) => {
    socket.emit("sendMessage", payload);
    setMessages((prev) => [
      ...prev,
      { ...payload, createdAt: new Date().toISOString() },
    ]);
  };

  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  if (!selectedUser)
    return (
      <div className="flex h-[75vh] items-center justify-center bg-base-300 rounded-lg shadow-lg">
        <div className="text-center opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="font-medium text-lg">Select a connection to chat</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-[75vh] bg-base-300 rounded-xl shadow-2xl overflow-hidden border border-base-200 relative">
      
      {/* HEADER */}
      <div className="bg-base-100 px-6 py-3 border-b border-base-200 flex items-center gap-4 shadow-sm z-10">
        <div className="avatar online">
          <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={getProfileImage(selectedUser)}
              onError={handleImageError}
              alt="User Avatar"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-base-content leading-tight">
            {selectedUser.firstName} {selectedUser.lastName}
          </h2>
          <span className="text-xs text-success font-semibold tracking-wide">● Active Now</span>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-base-200/50 scrollbar-thin scrollbar-thumb-base-300">
        {messages.map((msg, idx) => {
          const isSender = msg.senderId === loggedInUser?._id;
          const isCodeBlock = msg.message.trim().startsWith("```");

          return (
            <div
              key={msg._id || idx}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              {/* Profile Icon in Chat - FIXED */}
              <div className="chat-image avatar">
                <div className="w-10 h-10 rounded-full border border-base-300 shadow-sm bg-base-100 overflow-hidden">
                  <img
                    src={isSender ? getProfileImage(loggedInUser) : getProfileImage(selectedUser)}
                    onError={handleImageError}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Chat Header */}
              <div className="chat-header mb-1 text-xs font-medium opacity-60">
                {isSender ? "You" : selectedUser.firstName}
                <time className="ml-2 opacity-50 font-normal">{formatTime(msg.createdAt)}</time>
              </div>

              {/* Message Content */}
              {isCodeBlock ? (
                // CODE SNIPPET FORMAT (DaisyUI Mockup Code)
                <div className="chat-bubble bg-transparent p-0 max-w-[85%] sm:max-w-md md:max-w-lg shadow-xl">
                  <div className="mockup-code bg-[#1e1e1e] text-gray-100 border border-gray-700 text-sm">
                    <pre className="px-5 py-2">
                      <code className="whitespace-pre-wrap font-mono leading-relaxed">
                        {cleanCodeSnippet(msg.message)}
                      </code>
                    </pre>
                  </div>
                </div>
              ) : (
                // REGULAR TEXT FORMAT
                <div
                  className={`chat-bubble whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm ${
                    isSender
                      ? "chat-bubble-primary text-primary-content"
                      : "chat-bubble-secondary text-secondary-content"
                  }`}
                >
                  {msg.message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-base-100 border-t border-base-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-3 bg-base-200 p-2 rounded-3xl border border-base-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200"
        >
          {/* Code Canvas Button */}
          <button
            type="button"
            onClick={() => setIsCodeModalOpen(true)}
            className="btn btn-circle btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-300 tooltip tooltip-right"
            data-tip="Open Code Canvas"
          >
            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </button>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type a message..."
            className="textarea textarea-sm w-full bg-transparent focus:outline-none border-none resize-none h-10 min-h-[2.5rem] py-2 text-base leading-normal"
            rows={1}
          />

          <button 
            type="submit" 
            className={`btn btn-circle btn-sm btn-primary shadow-md transition-all active:scale-95 ${!newMessage.trim() ? 'btn-disabled opacity-50' : ''}`}
          >
            <svg
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* CODE EDITOR MODAL */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-base-100 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-base-300">
            {/* Modal Header */}
            <div className="bg-base-200 px-5 py-4 border-b border-base-300 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
                <span className="text-primary">
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 21" />
                  </svg>
                </span>
                Code Canvas
              </h3>
              <button 
                onClick={() => setIsCodeModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost hover:bg-base-300"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow bg-[#1e1e1e] relative group">
              <div className="absolute top-2 right-4 text-xs text-gray-500 font-mono pointer-events-none">JS/Text</div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Type or paste your code here..."
                className="w-full h-[50vh] bg-transparent text-gray-200 font-mono text-sm p-6 focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
                autoFocus
              ></textarea>
            </div>

            {/* Modal Footer */}
            <div className="bg-base-100 p-4 flex justify-end gap-3 border-t border-base-300">
              <button 
                onClick={() => setIsCodeModalOpen(false)}
                className="btn btn-ghost btn-sm font-normal"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendCode}
                className="btn btn-primary btn-sm px-6 gap-2"
                disabled={!codeSnippet.trim()}
              >
                Send Code Snippet
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
