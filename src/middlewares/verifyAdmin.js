// let usersCollection;

// const init = (db) => {
//   usersCollection = db.collection("users");
// };

// // use verify admin after verify token
// const verifyAdmin = async (req, res, next) => {
//   const email = req.decoded.email;
//   const query = { email: email };
//   const user = await usersCollection.findOne(query);
//   const isAmin = user?.role === "admin";
//   if (!isAmin) {
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }
//   next();
// };

// module.exports = {
//   init,
//   verifyAdmin,
// };
