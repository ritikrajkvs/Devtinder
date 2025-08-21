const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const { validateEditFields } = require("../utils/validation");
// Import the Cloudinary upload middleware
const upload = require("../Config/cloudinary");

// Profile API to get the profile details
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.post(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!validateEditFields(req)) {
        throw new Error("Invalid Edit request");
      }
      const loggedInUser = req.user;

      // **FIXED**: Handle skills and other fields correctly from multipart form
     Object.keys(req.body).forEach((key) => {
        // Skip photoURL as it's handled by the file upload
        if (key === 'photoURL') return; 

        if (key === 'skills' && typeof req.body.skills === 'string') {
          loggedInUser.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          loggedInUser[key] = req.body[key];
        }
      });

       if (req.file) {
        loggedInUser.photoURL = req.file.path; 
      }

      await loggedInUser.save();
      res.json({
        message: ` ${loggedInUser.firstName}, your profile updated successfully`,
        data: loggedInUser,
      });
    } catch (err) {
      // **FIXED**: Send error as a proper JSON object
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = profileRouter;
