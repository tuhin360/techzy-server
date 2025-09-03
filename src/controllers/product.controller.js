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



 

module.exports = { init, getProducts, getProductsByTag };
 
