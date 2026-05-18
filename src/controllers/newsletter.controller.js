const { ObjectId } = require("mongodb");

let subscribersCollection;

const init = (db) => {
  subscribersCollection = db.collection("subscribers");
};

// Subscribe new email
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }

    // Email format validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if duplicate exists
    const existing = await subscribersCollection.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(400).json({ error: "This email is already subscribed!" });
    }

    const result = await subscribersCollection.insertOne({
      email: trimmedEmail,
      subscribedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all subscribers (For Admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await subscribersCollection.find().sort({ subscribedAt: -1 }).toArray();
    res.send(subscribers);
  } catch (err) {
    console.error("Get subscribers error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete subscriber (For Admin only)
const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid subscriber ID" });
    }

    const result = await subscribersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    res.json({ success: true, message: "Subscriber successfully removed." });
  } catch (err) {
    console.error("Delete subscriber error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  init,
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber,
};
