let usersCollection;

const init = (db) => {
  usersCollection = db.collection("users");
};

// use verify admin after verify token
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const query = { email: email };
  const user = await usersCollection.findOne(query);
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "Forbidden access" });
  }
  next();
};

module.exports = {
  init,
  verifyAdmin,
};
