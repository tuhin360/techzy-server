const { ObjectId } = require("mongodb");

let couponCollection;

// Initialize and auto-seed standard active coupons
const init = async (db) => {
  couponCollection = db.collection("coupons");

  try {
    const count = await couponCollection.countDocuments();
    if (count === 0) {
      const defaultCoupons = [
        {
          code: "TECHZY20",
          discountPercent: 20,
          expiryDate: new Date("2028-12-31"),
          isActive: true,
          description: "20% off on all innovation gadget carts!",
          createdAt: new Date(),
        },
        {
          code: "SAVE10",
          discountPercent: 10,
          expiryDate: new Date("2028-12-31"),
          isActive: true,
          description: "Save 10% on tech gear and wearables.",
          createdAt: new Date(),
        },
        {
          code: "MEGA50",
          discountPercent: 50,
          expiryDate: new Date("2028-12-31"),
          isActive: true,
          description: "Special 50% mega coupon discount!",
          createdAt: new Date(),
        },
      ];
      await couponCollection.insertMany(defaultCoupons);
      console.log("✅ Default coupons seeded successfully");
    }
  } catch (err) {
    console.error("❌ Failed to seed coupons:", err);
  }
};

// Validate Coupon Code
const validateCoupon = async (req, res) => {
  try {
    const { code, totalPrice } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const coupon = await couponCollection.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid or inactive coupon code." });
    }

    // Check expiry date
    const currentDate = new Date();
    if (new Date(coupon.expiryDate) < currentDate) {
      return res.status(400).json({ error: "This coupon code has expired." });
    }

    // Calculate discount
    const discountAmount = Number(
      ((Number(totalPrice) * coupon.discountPercent) / 100).toFixed(2)
    );
    const newTotalPrice = Number((Number(totalPrice) - discountAmount).toFixed(2));

    res.status(200).json({
      success: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      newTotalPrice,
      description: coupon.description,
    });
  } catch (err) {
    console.error("Coupon validation error:", err);
    res.status(500).json({ error: "Failed to validate coupon." });
  }
};

// Get all coupons (Admin)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(coupons);
  } catch (err) {
    console.error("Fetch coupons error:", err);
    res.status(500).json({ error: "Failed to fetch coupons." });
  }
};

// Create a Coupon (Admin)
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiryDate, description } = req.body;

    if (!code || !discountPercent || !expiryDate) {
      return res.status(400).json({ error: "Code, discount percent, and expiry date are required." });
    }

    const exists = await couponCollection.findOne({ code: code.trim().toUpperCase() });
    if (exists) {
      return res.status(400).json({ error: "A coupon with this code already exists." });
    }

    const newCoupon = {
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      expiryDate: new Date(expiryDate),
      description: description || `${discountPercent}% discount coupon`,
      isActive: true,
      createdAt: new Date(),
    };

    const result = await couponCollection.insertOne(newCoupon);
    res.status(201).json({ success: true, id: result.insertedId, coupon: newCoupon });
  } catch (err) {
    console.error("Create coupon error:", err);
    res.status(500).json({ error: "Failed to create coupon." });
  }
};

// Delete a Coupon (Admin)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid coupon ID" });
    }

    const result = await couponCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon deleted successfully." });
  } catch (err) {
    console.error("Delete coupon error:", err);
    res.status(500).json({ error: "Failed to delete coupon." });
  }
};

module.exports = {
  init,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
};
