const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./auth');

// 登记捕获记录
router.post('/register', auth.verifyToken, (req, res) => {
  const { session_id, angler_id, spot_number, fish_number, weight, overall_count } = req.body;
  db.db.run(
    `INSERT INTO catches (session_id, angler_id, spot_number, fish_number, weight, overall_count)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [session_id, angler_id, spot_number, fish_number, weight, overall_count],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ catchId: this.lastID });
    }
  );
});

// 查询某场次捕获记录
router.get('/session/:sessionId', auth.verifyToken, (req, res) => {
  const sid = Number(req.params.sessionId);
  db.all(
    `SELECT c.*, a.name FROM catches c JOIN anglers a ON c.angler_id = a.id
     WHERE c.session_id = ? ORDER BY c.overall_count`,
    [sid], (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

module.exports = router;