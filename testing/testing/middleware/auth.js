const jwt = require('jsonwebtoken');
const secret_jwt='secretkey'

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ success: false, msg: "Token is required for verification." });
  }

  try {
    const decoded = jwt.verify(token,secret_jwt);
    req.user = decoded; 
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, msg: "Invalid token." });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, msg: "Token has expired." });
    } else {
      return res.status(500).json({ success: false, msg: "Internal server error." });
    }
  }
};

module.exports = verifyToken;