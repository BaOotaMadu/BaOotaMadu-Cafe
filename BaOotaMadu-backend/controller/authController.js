const Restaurant = require("../models/restaurantModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    const existing = await Restaurant.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const restaurant = await Restaurant.create({
      email,
      password: hashedPassword,
      phone,
      name: req.body.name || "",
        manager: req.body.manager || "",
        slogan: req.body.slogan || "",
        address: req.body.address || "",
        plan: req.body.plan || "Basic",
    });

    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      token,
      restaurantId: restaurant._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      restaurantId: restaurant._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET LOGGED-IN USER INFO
exports.getUser = async (req, res) => {
  try {
    const user = await Restaurant.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const { name, address, slogan, phone, plan } = req.body;

    const updated = await Restaurant.findByIdAndUpdate(
      req.user.id,
      { name, address, slogan, phone, plan },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await Restaurant.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ACCOUNT
exports.deleteUser = async (req, res) => {
  try {
    const user = await Restaurant.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// LOGOUT
exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};
