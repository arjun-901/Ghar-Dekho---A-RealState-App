import express from "express";
import Contact from "../models/contact.model.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, role } = req.body;
    const contact = await Contact.create({ name, email, phone, message, role });

    const adminEmail = process.env.EMAIL_USER;
    if (adminEmail) {
      try {
        await sendEmail({
          email: adminEmail,
          subject: "New Contact - ReeState",
          message: `<h2>New Contact</h2><p>From: ${name} (${email})</p><p>${message}</p>`,
        });
      } catch (e) { console.error(e); }
    }

    res.status(201).json({ success: true, message: "Message sent!", contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
