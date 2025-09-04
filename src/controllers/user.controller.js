let usersCollection;

const init = (db) => {
    usersCollection = db.collection("users");
};


// create user
const createUser = async (req, res) => {
    try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.status(201).send(result);
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

module.exports = { init, createUser, getAllUsers };