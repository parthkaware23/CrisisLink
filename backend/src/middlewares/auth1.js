const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("JWT_VERIFY_ERROR:", err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;