let usersCollection;

// Initialize the collection from your DB
const initAdminMiddleware = (db) => {
  usersCollection = db.collection("users");
};

// Middleware
const verifyAdmin = async (req, res, next) => {
  try {
    if (!usersCollection) {
      return res
        .status(500)
        .send({ message: "Users collection not initialized" });
    }

    // Make sure JWT middleware runs first and sets req.decoded
    const email = req.decoded?.email;
    if (!email) return res.status(401).send({ message: "Unauthorized" });

    const user = await usersCollection.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden: Admin only" });
    }

    next(); // User is admin, continue
  } catch (err) {
    console.error("verifyAdmin error:", err);
    res.status(500).send({ message: err.message });
  }
};

module.exports = { initAdminMiddleware, verifyAdmin };
