const Restaurant = require("../models/restaurantModel");


// GET restaurant profile
exports.getRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE address
exports.updateRestaurantAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { address },
      { new: true }
    );
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE plan
exports.updateRestaurantPlan = async (req, res) => {
  try {
    const { plan } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { plan },
      { new: true }
    );
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRestaurantByEmail = async (req, res) => {
  try {
    const { email, name, address, slogan, plan, manager, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to update restaurant profile" });
    }

    // Build the update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (address) updateFields.address = address;
    if (slogan) updateFields.slogan = slogan;
    if (plan) updateFields.plan = plan;
    if (manager) updateFields.manager = manager;
    if (phone) updateFields.phone = phone;

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant with this email not found" });
    }

    res.json({
      message: "Restaurant profile updated successfully",
      restaurant: updatedRestaurant,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
