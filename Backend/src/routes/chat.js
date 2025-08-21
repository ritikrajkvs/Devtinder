// Backend/src/routes/chat.js
const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const Message = require("../Models/message");

// Get messages between the logged-in user and another user
chatRouter.get("/chat/history/:otherUserId", userAuth, async (req, res) => {
  console.log("Fetching chat history");
  try {
    const loggedInUserId = req.user._id;
    const otherUserId = req.params.otherUserId;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: "asc" }); // Sort by creation time

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages: " + error.message });
  }
});

module.exports = chatRouter;