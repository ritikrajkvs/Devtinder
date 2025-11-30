import React, { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../utils/socket";

const CodeEditor = ({ userId, targetUserId, onClose }) => {
  const [code, setCode] = useState("// Start coding together!");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    // 1. Connect and Join Room
    const socket = createSocketConnection();
    socketRef.current = socket;
    
    // Sort IDs so both users generate the SAME Room ID (e.g., "UserA-UserB")
    const roomId = [userId, targetUserId].sort().join("-");
    socket.emit("joinCodeRoom", { roomId });

    // 2. Listen for code from the other person
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Send my code to the other person
    const roomId = [userId, targetUserId].sort().join("-");
    socketRef.current.emit("sendCode", { roomId, code: newCode });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-white/10">
      <div className="flex justify-between items-center p-2 bg-[#2d2d2d] text-white">
         <span className="text-xs font-mono text-green-400">● Live Sync Active</span>
         <button onClick={onClose} className="btn btn-xs btn-error">Close</button>
      </div>
      <textarea
        className="flex-1 bg-transparent text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
        value={code}
        onChange={handleChange}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
