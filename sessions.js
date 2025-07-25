const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./auth');

// 创建一个新场次
router.post('/', auth.verifyToken, (req, res) => {
  const { name } = req.body;
  db.db.run(
    'INSERT INTO sessions (name) VALUES (?)',
    [name],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ sessionId: this.lastID });
    }
  );
});

// 获取所有场次列表
router.get('/', auth.verifyToken, (req, res) => {
  db.all('SELECT * FROM sessions ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
