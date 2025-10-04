const { ObjectId } = require("mongodb");

let cartCollection;

const init = (db) => {
  cartCollection = db.collection("carts");
};

// POST: Add product to cart
const addToCart = async (req, res) => {
  try {
    const cartItem = req.body;
    if (!cartItem.email) {
      return res.status(400).send({ message: "User email is required" });
    }

    const query = {
      email: cartItem.email,
      menuId: cartItem.menuId,
    };

    // Check if already exists
    const existingItem = await cartCollection.findOne(query);
    if (existingItem) {
      return res
        .status(200)
        .send({ alreadyInCart: true, message: "Item already in cart" });
    }

    // Add timestamp and default status
    const cartItemWithDefaults = {
      ...cartItem,
      status: cartItem.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await cartCollection.insertOne(cartItemWithDefaults);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// GET: Fetch all cart items for a user
const getUserCart = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const items = await cartCollection.find({ email }).toArray();
    res.send(items);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PATCH: Update cart item quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).send({ 
        success: false, 
        message: "Quantity must be at least 1" 
      });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ 
        success: false, 
        message: "Invalid cart item ID" 
      });
    }

    const result = await cartCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          quantity: quantity,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ 
        success: false, 
        message: "Cart item not found" 
      });
    }

    res.send({ 
      success: true,
      message: "Cart quantity updated successfully", 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).send({ 
      success: false, 
      message: err.message 
    });
  }
};

// DELETE: Delete a cart item
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ 
        success: false, 
        message: "Invalid cart item ID" 
      });
    }

    const query = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Item not found" });
    }

    res.send({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = { 
  init, 
  addToCart, 
  getUserCart, 
  updateCartQuantity,
  deleteCart
};