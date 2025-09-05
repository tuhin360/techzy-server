// Verify Admin Role
// const verifyAdmin = async (req, res, next) => {
//   try {
//     const { email } = req.user;
    
//     // Assuming you have access to userCollection here
//     // You might need to pass db instance or import it
//     const db = req.app.locals.db; // or however you access your db
//     const userCollection = db.collection("users");
    
//     const user = await userCollection.findOne({ email: email });
    
//     if (!user) {
//       return res.status(404).send({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }

//     if (user.role !== "admin") {
//       return res.status(403).send({ 
//         success: false, 
//         message: "Access denied. Admin role required." 
//       });
//     }

//     next();
//   } catch (error) {
//     res.status(500).send({ 
//       success: false, 
//       message: "Internal server error", 
//       error: error.message 
//     });
//   }
// };

// module.exports = {
//   verifyToken,
//   verifyAdmin,
// };


// let usersCollection;

// // Initialize the collection from your DB
// const initAdminMiddleware = (db) => {
//   usersCollection = db.collection("users");
// };

// // Middleware
// const verifyAdmin = async (req, res, next) => {
//   try {
//     if (!usersCollection) {
//       return res
//         .status(500)
//         .send({ message: "Users collection not initialized" });
//     }

//     // Make sure JWT middleware runs first and sets req.decoded
//     const email = req.decoded?.email;
//     if (!email) return res.status(401).send({ message: "Unauthorized" });

//     const user = await usersCollection.findOne({ email });

//     if (!user || user.role !== "admin") {
//       return res.status(403).send({ message: "Forbidden: Admin only" });
//     }

//     next(); // User is admin, continue
//   } catch (err) {
//     console.error("verifyAdmin error:", err);
//     res.status(500).send({ message: err.message });
//   }
// };

// module.exports = { initAdminMiddleware, verifyAdmin };
