const Settings = require("../models/settingsModel");
const multer = require("multer");
const path = require("path");

// GET /settings/:restaurantId
const getSettings = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    let settings = await Settings.findOne({ restaurantId });
    if (!settings) {
      // Create default if not found
      settings = await Settings.create({ restaurantId });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// PUT /settings/:restaurantId
const updateSettings = async (req, res) => {
  const { restaurantId } = req.params;
  const data = req.body;
  try {
    const updated = await Settings.findOneAndUpdate(
      { restaurantId },
      data,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update settings" });
  }
};

// POST /settings/:restaurantId/logo
const uploadLogo = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const logoPath = req.file.path.replace(/\\/g, "/"); // Normalize path for Windows
    const logoUrl = `http://localhost:3001/${logoPath}`;

    const updated = await Settings.findOneAndUpdate(
      { restaurantId },
      { logoUrl },
      { new: true }
    );

    res.json({ logoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload logo" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  uploadLogo,
};