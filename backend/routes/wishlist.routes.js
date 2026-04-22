import express from "express";
import User from "../models/user.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get wishlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle wishlist
router.post("/toggle/:propertyId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const propertyId = req.params.propertyId;
    const index = user.wishlist.indexOf(propertyId);

    if (index === -1) {
      user.wishlist.push(propertyId);
    } else {
      user.wishlist.splice(index, 1);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
