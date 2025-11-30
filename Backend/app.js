const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const path = require("path");

// 1. IMPORT THE MESSAGE MODEL
const Message = require("./src/Models/message"); 

// Routes
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
const chatRouter = require("./src/routes/chat");

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

// SETUP SOCKET.IO CORS
const io = new Server(server, {
  cors: {
    origin: "https://ubiquitous-naiad-ba85d9.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// SETUP EXPRESS CORS
app.use(
  cors({
    origin: "https://ubiquitous-naiad-ba85d9.netlify.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// DEFINE ROUTES
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

// Socket Logic
const userSocketMap = {}; 
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    // 2. SAVE MESSAGE TO DATABASE
    try {
      await Message.create({ senderId, receiverId, message }); 
    } catch (err) {
      console.log(err);
    }

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { senderId, message });
    }
  });
  // ... inside io.on("connection", (socket) => { ...

 // 🚀 NEW: Collaborative Coding Logic
  
  // 1. Join a specific "Coding Room"
  socket.on("joinCodeRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  // 2. Sync Code Changes
  socket.on("sendCode", ({ roomId, code }) => {
    // Send the new code to everyone in the room EXCEPT the person typing
    socket.to(roomId).emit("codeUpdate", code);
  }); 

// ... end of io.on })
  socket.on("disconnect", () => {
    for (let id in userSocketMap) {
      if (userSocketMap[id] === socket.id) delete userSocketMap[id];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

connectDB().then(() => {
  server.listen(process.env.PORT || 7777, () => {
    console.log(`Server running on port ${process.env.PORT || 7777}`);
  });
}).catch((err) => {
  console.error("Database connection failed:", err);
});
