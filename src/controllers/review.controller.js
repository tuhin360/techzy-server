let reviewCollection;

const init = (db) => {
  reviewCollection = db.collection("reviews");
};

// ✅ Create Review
const addReviews = async (req, res) => {
  try {
    const review = req.body;

    // Validation
    if (!review.name || !review.details || review.rating == null) {
      return res
        .status(400)
        .json({ message: "Name, details & rating are required" });
    }

    review.createdAt = new Date();

    const result = await reviewCollection.insertOne(review);
    res.status(201).json({
      message: "Review added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await reviewCollection
      .find({})
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { init, addReviews, getReviews };
