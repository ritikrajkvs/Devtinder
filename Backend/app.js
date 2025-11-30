const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const path = require("path");

// Routes
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
const chatRouter = require("./src/routes/chat"); // Ensure this file exists

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

// 1. SETUP SOCKET.IO CORS
const io = new Server(server, {
  cors: {
    origin: "https://ubiquitous-naiad-ba85d9.netlify.app", // Your Netlify URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 2. SETUP EXPRESS CORS (Must match frontend URL exactly)
app.use(
  cors({
    origin: "https://ubiquitous-naiad-ba85d9.netlify.app", 
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 3. DEFINE ROUTES
// These prefixes must match your frontend BASE_URL + Route
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
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { senderId, message });
    }
  });

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
