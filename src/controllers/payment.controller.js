// controllers/payment.controller.js
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

let paymentCollection;
let cartCollection;

// Initialize collections
const init = (db) => {
  paymentCollection = db.collection("payments");
  cartCollection = db.collection("carts");
};

// Create Stripe PaymentIntent
const payment = async (req, res) => {
  try {
    const { price } = req.body;
    if (!price) return res.status(400).json({ error: "Price is required" });

    const amount = Math.round(Number(price) * 100); // convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // Stripe does not support BDT
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Error creating PaymentIntent:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

// Save payment info to DB and remove items from cart
const savePayment = async (req, res) => {
  try {
    const {
      email,
      transactionId,
      amount,
      date,
      cartItems,
      menuItems,
      status = "pending",
    } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Save payment info with additional order details
    const paymentData = {
      email,
      transactionId,
      amount: Number(amount),
      date: new Date(date),
      cartItems,
      menuItems,
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await paymentCollection.insertOne(paymentData);

    // Delete purchased items from cart
    const query = {
      _id: { $in: cartItems.map((id) => new ObjectId(id)) },
    };

    const deleteResult = await cartCollection.deleteMany(query);

    res.status(201).json({
      success: true,
      id: result.insertedId,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (err) {
    console.error("Failed to save payment:", err);
    res.status(500).json({ error: "Failed to save payment" });
  }
};

// Get all payments by email (for user)
const getAllPaymentsByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const payments = await paymentCollection
      .find({ email })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// Get all payments (for admin - manage orders)
const getAllPayments = async (req, res) => {
  try {
    const { status, email, page = 1, limit = 50 } = req.query;

    // Build query object
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await paymentCollection.countDocuments(query);

    // Get payments with pagination and sorting
    const payments = await paymentCollection
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.status(200).json({
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + payments.length < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid payment ID" });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await paymentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Get updated payment for logging
    const updatedPayment = await paymentCollection.findOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
      status: status,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status" });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid payment ID" });
    }

    // Get payment info before deletion for logging
    const paymentToDelete = await paymentCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!paymentToDelete) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Check if payment can be deleted (only allow deletion of pending, confirmed, or cancelled orders)
    const deletableStatuses = ["pending", "confirmed", "cancelled"];
    if (!deletableStatuses.includes(paymentToDelete.status)) {
      return res.status(400).json({
        error: `Cannot delete payment with status: ${paymentToDelete.status}. Only pending, confirmed, or cancelled payments can be deleted.`,
      });
    }

    const result = await paymentCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
};

module.exports = {
  init,
  payment,
  savePayment,
  getAllPaymentsByEmail,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
};
