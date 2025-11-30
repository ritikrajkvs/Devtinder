import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import CodeEditor from "./CodeEditor";

const ChatWindow = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCode, setShowCode] = useState(false);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      setMessages(chat.data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((prev) => [...prev, { text, senderId: targetUserId }]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setMessages((prev) => [...prev, { text: newMessage, senderId: userId }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[85vh] container mx-auto px-4 py-6 max-w-7xl gap-4 overflow-hidden">
       
       {/* LEFT SIDE: Chat */}
       {/* FIX: Use calc() to handle width perfectly with the gap */}
       <div className={`flex flex-col transition-all duration-300 h-full ${showCode ? 'w-[calc(50%-0.5rem)]' : 'w-full'}`}>
           {/* Header */}
           <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 p-4 rounded-t-3xl shadow-lg flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="avatar online">
                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="https://geographyandyou.com/images/user-profile.png" alt="User" /> 
                        </div>
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">Chat Room</h2>
                        <p className="text-xs text-green-400 font-medium">Online</p>
                    </div>
                </div>

                <button 
                  onClick={() => setShowCode(!showCode)}
                  className={`btn btn-sm ${showCode ? 'btn-error' : 'btn-primary'}`}
                >
                  {showCode ? "Close Code" : "Code Together 👨‍💻"}
                </button>
           </div>

           {/* Messages */}
           <div className="flex-1 bg-[#0f172a]/50 border-x border-white/5 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
              {messages.map((msg, index) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                        <div className={`chat-bubble ${isMe ? "chat-bubble-primary text-white" : "bg-[#1e293b] text-gray-200"}`}>
                            {msg.text}
                        </div>
                    </div>
                  );
              })}
           </div>

           {/* Input */}
           <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 p-4 rounded-b-3xl shadow-lg shrink-0">
               <div className="flex gap-2">
                   <input 
                     type="text" 
                     className="input input-bordered w-full bg-[#0f172a] border-gray-700 text-white focus:border-primary rounded-xl"
                     placeholder="Type a message..."
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                   />
                   <button onClick={sendMessage} className="btn btn-primary rounded-xl px-6 text-white">Send</button>
               </div>
           </div>
       </div>

       {/* RIGHT SIDE: Code Editor */}
       {/* FIX: Rendered with explicit width calculation to avoid overflow */}
       {showCode && (
         <div className="w-[calc(50%-0.5rem)] h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#1e1e1e]">
            <CodeEditor 
              userId={userId} 
              targetUserId={targetUserId} 
              onClose={() => setShowCode(false)} 
            />
         </div>
       )}
    </div>
  );
};

export default ChatWindow;
