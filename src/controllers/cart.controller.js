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



module.exports = { init, addToCart, getUserCart };
