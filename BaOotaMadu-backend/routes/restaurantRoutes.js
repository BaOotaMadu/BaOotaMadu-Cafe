const express = require("express");
const Restaurant = require("../models/restaurantModel");

const router = express.Router();
const {
  getRestaurantProfile,
  updateRestaurantAddress,
  updateRestaurantPlan,
  updateRestaurantByEmail,
} = require("../controller/restaurantController");

const authController = require("../controller/authController");
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/:id", getRestaurantProfile);
router.put("/:id/address", updateRestaurantAddress);
router.put("/:id/plan", updateRestaurantPlan);
router.put("/update-by-email", async (req, res) => {
  const { email, name, manager, phone, address, slogan, plan } = req.body;

  console.log("Incoming update:", req.body);

  try {
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
      console.log("Restaurant not found for:", email);
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (plan && !["Basic", "Pro", "Enterprise"].includes(plan)) {
      console.log("Invalid plan:", plan);
      return res.status(400).json({ message: "Invalid plan value" });
    }

    restaurant.name = name ?? restaurant.name;
    restaurant.manager = manager ?? restaurant.manager;
    restaurant.phone = phone ?? restaurant.phone;
    restaurant.address = address ?? restaurant.address;
    restaurant.slogan = slogan ?? restaurant.slogan;
    restaurant.plan = plan ?? restaurant.plan;

    await restaurant.save();

    console.log("Successfully updated:", restaurant);

    res.status(200).json({ message: "Profile updated", restaurant });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});





module.exports = router;
