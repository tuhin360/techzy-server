const jwt = require("jsonwebtoken");

const generateToken = (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  res.send({ token });
};

const verifyToken = (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: false, message: "Invalid token" });
    }
    res.send({ success: true, decoded });
  });
};

module.exports = { generateToken, verifyToken };
