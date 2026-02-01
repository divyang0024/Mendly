import Session from "../models/Session.model.js";
import Message from "../models/Message.model.js";

/* DELETE SESSION */
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findOne({
      _id: id,
      userId: req.userId, // ✅ use the normalized value
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await Message.deleteMany({ sessionId: id });
    await Session.deleteOne({ _id: id });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

