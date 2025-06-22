const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuModel");

// Create Menu Item (Ensures restaurantId is included)
router.post("/add", async (req, res) => {
  try {
    const { name, price, category, image_url } = req.body;
    const restaurantId = "681f3a4888df8faae5bbd380";
    //if (!restaurantId) {
     // return res.status(400).json({ error: "Restaurant ID is required" });
    //}
    const newItem = new MenuItem({ restaurant_id: restaurantId, name, price, category, image_url });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Menu Items for Specific Restaurant (Fixing incorrect param reference)
router.get("/:restaurant_id", async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant_id: req.params.restaurant_id });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Menu Item (Ensures correct parameter handling)
router.put("/update/:id", async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updateAvailable/:id", async (req, res) => {
  try {
    const { available } = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { available }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Menu Item (Ensures handling for non-existent items)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
