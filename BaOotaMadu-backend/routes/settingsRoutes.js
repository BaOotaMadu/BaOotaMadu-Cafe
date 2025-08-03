const express = require("express");
const multer = require("multer");
const path = require("path");
const { getSettings, updateSettings, uploadLogo } = require("../controller/settingsController.js");

const router = express.Router();

// Multer storage for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/logos/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.restaurantId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/settings/:restaurantId", getSettings);
router.put("/settings/:restaurantId", updateSettings);
router.post("/settings/:restaurantId/logo", upload.single("logo"), uploadLogo);

module.exports = router;
