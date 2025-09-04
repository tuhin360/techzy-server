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

    const result = await cartCollection.insertOne(cartItem);
    res.status(201).send(result);
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

    // const items = await cartCollection.find().toArray();
    // res.send(items);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

 
 // DELETE: Delete a cart item
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params; 
    const query = { _id: new ObjectId(id) };  
    const result = await cartCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Item not found" });
    }

    res.send({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};


module.exports = { init, addToCart, getUserCart, deleteCart };
