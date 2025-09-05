const { ObjectId } = require("mongodb");

let productCollection;

const init = (db) => {
  productCollection = db.collection("products");
};

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await productCollection.find().toArray();
    res.send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// GET products by tag
// Example: GET /products/filter?tag=new
const getProductsByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) return res.status(400).send({ message: "Tag is required" });

    const products = await productCollection.find({ tags: tag }).toArray();
    res.send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// DELETE product by id
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid product ID" });
    }

    const query = { _id: new ObjectId(id) };
    const result = await productCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send({ success: true, deletedCount: result.deletedCount, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  init,
  getProducts,
  getProductsByTag,
  deleteProduct,
};
