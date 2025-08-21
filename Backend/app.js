const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const path = require("path");
const chatRouter = require("./src/routes/chat");

// 1. Import http and Server from socket.io
const http = require("http");
const { Server } = require("socket.io");

// 2. Create an HTTP server from the Express app
const server = http.createServer(app);

// 3. Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Middlewares (order matters!)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());   // ✅ Add cookie parser middleware here
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

//routes
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
const Message = require("./src/Models/message");

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

// 4. Add Socket.IO connection logic
const userSocketMap = {}; // Maps userId to socketId

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  
  // Emit online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      // Send the message to the specific receiver
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        message,
      });
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
      await newMessage.save();
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from the map and update online users list
    for (let id in userSocketMap) {
      if (userSocketMap[id] === socket.id) {
        delete userSocketMap[id];
        break;
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// 5. Change app.listen to server.listen
connectDB().then(() => {
  try {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on ` + process.env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
});
