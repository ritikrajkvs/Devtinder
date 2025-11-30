// Backend/src/routes/user.js (UPDATED)
const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const { ConnectionRequestModel } = require("../Models/connectionRequest");
const User = require("../Models/user");
const asyncHandler = require("../utils/asyncHandler"); // <--- NEW IMPORT

// The data fields that are safe to expose in the feed and connections
const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";

// Route 1: Recieved Requests (Using asyncHandler, Lean for performance)
userRouter.get("/user/requests/recieved", userAuth, asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .lean(); // CRITICAL: Use .lean() for faster query results

    return res.status(200).json({
      connectionRequests: connectionRequests || [],
    });
}));

// Route 2: Connections (Using asyncHandler, Lean for performance)
userRouter.get("/user/connections", userAuth, asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
    .populate("fromUserId toUserId", USER_SAFE_DATA)
    .lean(); // CRITICAL: Use .lean() for faster query results

    const data = connectionRequests.map((row) => {
      // Use Mongoose .equals() for robust ID comparison
      if (row.fromUserId._id.equals(loggedInUser._id)) { 
        return row.toUserId;
      }
      // Since .lean() is used, the populated fields are plain objects/IDs
      return row.fromUserId;
    });

    res.status(200).json({
      data,
    });
}));

// Route 3: Feed (Optimized Query and using asyncHandler)
userRouter.get("/user/feed", userAuth, asyncHandler(async (req, res) => {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page || 1);
    let limit = parseInt(req.query.limit || 10);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // OPTIMIZATION: Use Mongoose .distinct() to efficiently fetch the IDs of users 
    // the current user has already interacted with (sent/received requests).
    const connectedToUser = await ConnectionRequestModel.distinct("toUserId", { fromUserId: loggedInUser._id });
    const connectedFromUser = await ConnectionRequestModel.distinct("fromUserId", { toUserId: loggedInUser._id });
    
    // Combine all IDs to exclude (self, users sent request to, users received request from)
    const hideUsersFromFeed = new Set([
      loggedInUser._id.toString(),
      ...connectedToUser.map(id => id.toString()),
      ...connectedFromUser.map(id => id.toString()),
    ]);
    
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit)
      .lean(); // CRITICAL: Use .lean() for maximum read performance

    res.status(200).send(users);
}));
module.exports = userRouter;
