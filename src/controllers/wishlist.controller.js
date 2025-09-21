const { ObjectId } = require("mongodb");

let wishListCollection;

// ✅ Initialize collection (same as your cart pattern)
const init = (db) => {
  wishListCollection = db.collection("wishlist");
};

// ✅ Get all wishlist items by user email
const getWishList = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).send({ message: "Email is required" });

    const items = await wishListCollection.find({ email }).toArray();
    res.send(items);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ✅ Add item to wishlist
const addToWishList = async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!email || !productId) {
      return res.status(400).send({ message: "Email and productId are required" });
    }

    // Prevent duplicates
    const exists = await wishListCollection.findOne({ email, productId });
    if (exists) {
      return res.status(400).send({ message: "Already in wishlist" });
    }

    const newItem = {
      email,
      productId,
      createdAt: new Date(),
    };

    const result = await wishListCollection.insertOne(newItem);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ✅ Remove item from wishlist
const removeFromWishList = async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!email || !productId) {
      return res.status(400).send({ message: "Email and productId are required" });
    }

    const result = await wishListCollection.deleteOne({ email, productId });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Item not found in wishlist" });
    }

    res.send({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  init,
  getWishList,
  addToWishList,
  removeFromWishList,
};
