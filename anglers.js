const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./auth');

// 批量导入钓友
router.post('/import', auth.verifyToken, (req, res) => {
  try {
    const list = req.body;
    const stmt = db.db.prepare(
      'INSERT INTO anglers (name, phone) VALUES (?, ?)'
    );
    list.forEach(a => stmt.run(a.name, a.phone));
    stmt.finalize();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 查询钓友列表
router.get('/', auth.verifyToken, (req, res) => {
  db.all('SELECT * FROM anglers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;