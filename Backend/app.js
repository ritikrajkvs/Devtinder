// File: Backend/app.js
// Description: Main server file with corrected Socket.IO data serialization.

const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const path = require("path");

const http = require("http");
const { Server } = require("socket.io");
const Message = require('./src/Models/message'); // Import the Message model

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// --- Routes ---
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
const chatRouter = require("./src/routes/chat");

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

// --- Socket.IO Logic (REPLACE existing io.on('connection'...) block) ---
const userSocketMap = {}; // userId -> socketId

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Read userId from the query (frontend connects with ?userId=...)
  const userId = socket.handshake.query?.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // optional: join a personal room
    socket.join(`user:${userId}`);
    console.log(`Mapped user ${userId} -> ${socket.id}`);
  }

  // Notify all clients who is online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle sendMessage with acknowledgement
  socket.on("sendMessage", async (data, ack) => {
    try {
      const { senderId, receiverId, message } = data;
      if (!senderId || !receiverId || !message) {
        if (ack && typeof ack === "function") ack({ ok: false, error: "Missing fields" });
        return;
      }

      // Save into DB
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });

      // Convert to plain object and normalize ids to strings
      const plainMsg = newMessage.toObject();
      if (plainMsg.senderId && typeof plainMsg.senderId.toString === "function")
        plainMsg.senderId = plainMsg.senderId.toString();
      if (plainMsg.receiverId && typeof plainMsg.receiverId.toString === "function")
        plainMsg.receiverId = plainMsg.receiverId.toString();

      // Emit to receiver if online
      const receiverSocketId = userSocketMap[plainMsg.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", plainMsg);
      }

      // Echo back to sender so they get server-confirmed message (use sender's socket if available)
      const senderSocketId = userSocketMap[plainMsg.senderId] || socket.id;
      io.to(senderSocketId).emit("newMessage", plainMsg);

      // Ack to caller with saved message (optional)
      if (ack && typeof ack === "function") ack({ ok: true, message: plainMsg });
    } catch (error) {
      console.error("Error handling sendMessage:", error);
      if (ack && typeof ack === "function") ack({ ok: false, error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // remove socket mapping
    for (const id in userSocketMap) {
      if (userSocketMap[id] === socket.id) {
        delete userSocketMap[id];
        break;
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// --- end Socket.IO Logic ---


connectDB().then(() => {
  try {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on ` + process.env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
});
