const express = require("express");
const authRouter = express.Router();
const User = require("../Models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { validateSignupData } = require("../utils/validation");

// Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignupData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;

    // Check email already exists
    const checkEmail = await User.findOne({ emailId });
    if (checkEmail) {
      throw new Error("Email Already Exist");
    }

    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });

    const savedUser = await user.save();
    const token = await savedUser.getjwt();

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,              // Prevents JS access
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "none",          // protects against CSRF
      maxAge: 8 * 3600000,         // 8 hours
    });

    res.status(200).json({
      message: "User added successfully",
      user: savedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getjwt();

      // ✅ Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 8 * 3600000,
      });

      res.status(200).json({ user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// Logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.send("User Logged out successfully");
});

module.exports = authRouter;
