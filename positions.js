const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./auth');

// 创建比赛场次
router.post('/sessions', auth.verifyToken, (req, res) => {
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

// 获取场次列表
router.get('/sessions', auth.verifyToken, (req, res) => {
  db.all('SELECT * FROM sessions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 手动分配钓位
router.post('/sessions/:sessionId/assign', auth.verifyToken, (req, res) => {
  const sessionId = Number(req.params.sessionId);
  const { spot_number, angler_id } = req.body;
  db.db.run(
    `INSERT OR REPLACE INTO positions (
      session_id, spot_number, angler_id, assigned_at
    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [sessionId, spot_number, angler_id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// 获取分配结果
router.get('/sessions/:sessionId/positions', auth.verifyToken, (req, res) => {
  const sessionId = Number(req.params.sessionId);
  db.all(
    `SELECT p.spot_number, a.name, a.phone
     FROM positions p
     JOIN anglers a ON p.angler_id = a.id
     WHERE p.session_id = ?
     ORDER BY p.spot_number`,
    [sessionId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;