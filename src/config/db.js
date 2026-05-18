const { MongoClient, ServerApiVersion } = require("mongodb");

// Direct connection (bypasses SRV DNS lookup — required for Node.js v26+)
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-ljpm8jd-shard-00-00.ejucsc6.mongodb.net:27017,ac-ljpm8jd-shard-00-01.ejucsc6.mongodb.net:27017,ac-ljpm8jd-shard-00-02.ejucsc6.mongodb.net:27017/?replicaSet=atlas-iszs5a-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully!");
    return client.db("techzyDB");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
    console.error("➡ Fix: Whitelist your IP on MongoDB Atlas → Network Access");
    throw err; // Let caller handle — server stays alive
  }
}

module.exports = connectDB;

