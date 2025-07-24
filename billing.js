const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./auth');

// 结算某条中鱼记录：计算净重并入库
router.post('/settle/:catchId', auth.verifyToken, (req, res) => {
  const catchId = Number(req.params.catchId);
  db.all('SELECT weight FROM catches WHERE id = ?', [catchId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const weight = rows[0].weight;
    const net = weight - 6;
    let fee;
    if (net < 20)       fee = 50;
    else if (net < 30)  fee = 100;
    else if (net < 40)  fee = 200;
    else if (net < 50)  fee = 400;
    else                fee = 800;

    db.db.run(
      'INSERT INTO billing (catch_id, net_weight, fee) VALUES (?, ?, ?)',
      [catchId, net, fee],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ billingId: this.lastID, net_weight: net, fee });
      }
    );
  });
});

// 获取某场次所有结算记录
router.get('/session/:sessionId', auth.verifyToken, (req, res) => {
  const sid = Number(req.params.sessionId);
  db.all(
    `SELECT b.id, b.net_weight, b.fee, b.settled_at,
            c.spot_number, a.name, c.weight AS original_weight
     FROM billing b
     JOIN catches c ON b.catch_id = c.id
     JOIN anglers a ON c.angler_id = a.id
     WHERE c.session_id = ?`,
    [sid],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;
