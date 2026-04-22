import express from "express";
import Inquiry from "../models/inquiry.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create inquiry
router.post("/", protect, async (req, res) => {
  try {
    const { propertyId, sellerId, name, email, phone, message } = req.body;
    const inquiry = await Inquiry.create({
      property: propertyId,
      buyer: req.user._id,
      seller: sellerId,
      name,
      email,
      phone,
      message,
    });
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get inquiries for seller
router.get("/seller", protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ seller: req.user._id })
      .populate("property", "title images")
      .populate("buyer", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get inquiries for buyer
router.get("/buyer", protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate("property", "title images price city")
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark inquiry as read
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get seller stats
router.get("/seller/stats", protect, async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments({ seller: req.user._id });
    const newInquiries = await Inquiry.countDocuments({ seller: req.user._id, status: "new" });
    res.json({ success: true, totalInquiries, newInquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
