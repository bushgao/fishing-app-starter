/**
 * @file routes/auth.js
 * @description 钓场管理人员认证接口
 *
 * @route POST /api/login
 *   登录，返回 JWT token
 *   body: { username: string, password: string }
 */
const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.post('/login', async (req, res, next) => {
  // Copilot 会帮你补全校验 username/password 并调用 auth.generateToken()
});

module.exports = router;

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