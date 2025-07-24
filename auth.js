const jwt = require('jsonwebtoken');
const SECRET = 'your_secret_key';

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

function verifyToken(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, verifyToken };