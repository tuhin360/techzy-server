let contactCollection;

const init = (db) => {
  contactCollection = db.collection("contacts");
};

// ✅ Create Contact Message
const addContactMessage = async (req, res) => {
  try {
    const contact = req.body;

    // Validation
    if (!contact.user_name || !contact.user_email || !contact.message) {
      return res
        .status(400)
        .json({ message: "Name, email & message are required" });
    }

    contact.createdAt = new Date();

    const result = await contactCollection.insertOne(contact);
    res.status(201).json({
      message: "Message received successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding contact message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Contact Messages (Admin only lookup if needed in future)
const getContactMessages = async (req, res) => {
  try {
    const messages = await contactCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { init, addContactMessage, getContactMessages };
