import express from "express";
import Chat from "../models/chat.model.js";
import { protect } from "../middleware/auth.middleware.js";

const chatRouter = express.Router();

// Create or get chat
chatRouter.post("/start", protect, async (req, res) => {
  try {
    const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;

    let buyerId, finalSellerId;

    if (req.user.role === "seller") {
      buyerId = providedBuyerId;
      finalSellerId = req.user._id;
    } else {
      buyerId = req.user._id;
      finalSellerId = sellerId;
    }

    if (!buyerId || !finalSellerId) {
      return res.status(400).json({ message: "Missing buyer or seller ID" });
    }

    let chat = await Chat.findOne({
      buyer: buyerId,
      seller: finalSellerId,
    });

    if (!chat) {
      chat = await Chat.create({
        property: propertyId,
        buyer: buyerId,
        seller: finalSellerId,
        messages: [],
      });
    }

    chat = await Chat.findById(chat._id)
      .populate("buyer", "name email profilePic")
      .populate("seller", "name email profilePic")
      .populate("property", "title price images");

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating or getting chat", error: err.message });
  }
});

// Get all chats for a user
chatRouter.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("buyer", "name email profilePic")
      .populate("seller", "name email profilePic")
      .populate("property", "title price images")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats", error: err.message });
  }
});

// Get messages for a chat
chatRouter.get("/:chatId/messages", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("messages.sender", "name profilePic");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

// Send a message
chatRouter.post("/:chatId/message", protect, async (req, res) => {
  try {
    const { text, image } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.push({
      sender: req.user._id,
      text: text || "",
      image: image || "",
    });

    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate("messages.sender", "name profilePic");

    res.json(updatedChat.messages[updatedChat.messages.length - 1]);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
});

// Delete a message
chatRouter.delete("/:chatId/message/:messageId", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages = chat.messages.filter(
      (msg) => msg._id.toString() !== req.params.messageId
    );

    await chat.save();
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message", error: err.message });
  }
});

// Delete a chat
chatRouter.delete("/:chatId", protect, async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.chatId);
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting chat", error: err.message });
  }
});

export default chatRouter;
