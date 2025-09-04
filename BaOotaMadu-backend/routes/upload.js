import express from "express";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../middleware/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/usermodel.js"; // your MongoDB User model

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "baootamadu",
    });

    // Save URL in MongoDB (example: profile pic update)
    const user = await User.findById(req.user.id);
    user.profilePic = result.secure_url;
    await user.save();

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
