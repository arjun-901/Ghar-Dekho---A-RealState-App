import express from "express";
import User from "../models/user.model.js";
import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get dashboard stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeListings = await Property.countDocuments({ status: "sale" });
    const soldProperties = await Property.countDocuments({ status: "sold" });
    res.json({ success: true, totalUsers, totalProperties, activeListings, soldProperties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Block/Unblock user
router.patch("/users/:id/block", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get seller requests (unapproved sellers)
router.get("/seller-requests", protect, adminOnly, async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller", isApproved: false }).select("-password");
    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Approve seller
router.patch("/approve-seller/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isApproved = true;
    await user.save();
    res.json({ success: true, message: "Seller approved", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all inquiries (admin)
router.get("/inquiries", protect, adminOnly, async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("property", "title")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
