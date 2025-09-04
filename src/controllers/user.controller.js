const { ObjectId } = require("mongodb");

let usersCollection;

const init = (db) => {
  usersCollection = db.collection("users");
};

// insert user on db if user does not exist
const createUser = async (req, res) => {
  try {
    const user = req.body;
    // insert email if user does not exist
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists", insertedId: null });
    }

    const result = await usersCollection.insertOne(user);
    res.status(201).send({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send({
      success: result.deletedCount > 0,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: "admin",
      },
    };
    const result = await usersCollection.updateOne(query, updateDoc);
    res.send({ success: result.modifiedCount > 0, result });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


module.exports = { init, createUser, getAllUsers, deleteUser, updateUserRole };
