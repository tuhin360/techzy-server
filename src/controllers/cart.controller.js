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

    // Add timestamp and default status
    const cartItemWithDefaults = {
      ...cartItem,
      status: cartItem.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await cartCollection.insertOne(cartItemWithDefaults);
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
      return res
        .status(404)
        .send({ success: false, message: "Item not found" });
    }

    res.send({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};


// GET: Get all users carts (for admin/orders management)
// const getUsersAllCarts = async (req, res) => {
//   try {
//     const carts = await cartCollection.find().toArray();
    
//     // Format the data for better frontend handling
//     const formattedCarts = carts.map(cart => ({
//       ...cart,
//       status: cart.status || 'pending',
//       orderDate: cart.createdAt || cart.orderDate || new Date(),
//       phone: cart.phone || 'N/A'
//     }));
    
//     res.send(formattedCarts);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

// // PATCH: Update cart item status
// const updateCartStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     // Validate status
//     if (!status || !['pending', 'done'].includes(status)) {
//       return res.status(400).send({ message: "Invalid status. Must be 'pending' or 'done'" });
//     }

//     const result = await cartCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { 
//         $set: { 
//           status: status, 
//           updatedAt: new Date() 
//         } 
//       }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).send({ message: "Cart item not found" });
//     }

//     res.send({ 
//       message: "Cart status updated successfully", 
//       modifiedCount: result.modifiedCount 
//     });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

module.exports = { 
  init, 
  addToCart, 
  getUserCart, 
  deleteCart, 
  // getUsersAllCarts, 
  // updateCartStatus 
};