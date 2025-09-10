const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let paymentCollection;

const init = (db) => {
  paymentCollection = db.collection("payments");
};

const payment = async (req, res) => {
  const { price } = req.body;
  const amount = Math.round(price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "bdt",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

// save payment info to DB
const savePayment = async (req, res) => {
  try {
    const { email, transactionId, amount, date, cartItems } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await paymentCollection.insertOne({
      email,
      transactionId,
      amount,
      date,
      cartItems,
      status: "pending",
    });

    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Failed to save payment:", err);
    res.status(500).json({ error: "Failed to save payment" });
  }
};

module.exports = {
  init,
  payment,
  savePayment,
};
