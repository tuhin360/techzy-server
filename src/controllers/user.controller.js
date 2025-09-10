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
  console.log(req.headers);
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

// update user role toggle
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };

    // find current user
    const user = await usersCollection.findOne(query);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // toggle role
    const newRole = user.role === "admin" ? "user" : "admin";

    const updateDoc = {
      $set: { role: newRole },
    };

    const result = await usersCollection.updateOne(query, updateDoc);

    res.send({ success: result.modifiedCount > 0, newRole });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// check if user is admin or not after verify token
const verifyAdmin = async (req, res) => {
  try {
    const email = req.params.email;

    // make sure JWT email matches
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isAdmin = user.role === "admin";

    res.send({ admin: isAdmin });
  } catch (err) {
    console.error("checkAdmin error:", err);
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  init,
  createUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
  verifyAdmin
};


