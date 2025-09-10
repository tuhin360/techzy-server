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

    res.send({
      success: true,
      deletedCount: result.deletedCount,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).send({ success: false, message: err.message });
  }
};

// create add new product
const addProduct = async (req, res) => {
  try {
    const product = req.body;

    // Basic validation
    if (!product.title || !product.price || !product.category) {
      return res.status(400).send({
        message: "Title, price, and category are required",
      });
    }

    const result = await productCollection.insertOne(product);
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.findOne(query);
  res.send(result);
};

const updateProductById = async (req, res) => {
  const id = req.params.id;
  const product = req.body;
  const query = { _id: new ObjectId(id) };
  const updateDoc = { $set: product };
  const result = await productCollection.updateOne(query, updateDoc);
  res.send(result);
};

module.exports = {
  init,
  getProducts,
  getProductsByTag,
  deleteProduct,
  addProduct,
  getProductById,
  updateProductById,
};
