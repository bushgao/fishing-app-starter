/**
 * @file routes/catches.js
 * @description 中鱼记录（Catch）管理
 *
 * @route GET    /api/catches/:sessionId        获取某场次所有中鱼记录
 * @route POST   /api/catches                   新增一次中鱼记录
 *   body: {
 *     session_id: number,
 *     angler_id: number,
 *     position_id: number,
 *     weight: number,            // 实测重量
 *     fish_number_in_angler: number,  // 该钓友第几条鱼
 *     fish_number_overall: number     // 本场全场第几条鱼
 *   }
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const tts = require('../tts'); // 语音播报模块

router.get('/:sessionId', /* SELECT * FROM catches WHERE session_id = ? */);

router.post('/', async (req, res, next) => {
  try {
    const {
      session_id, angler_id, position_id,
      weight, fish_number_in_angler, fish_number_overall
    } = req.body;
    // 1) 插入 catches 表
    // 2) 调用 tts.play(`全场第${fish_number_overall}尾，钓位${position_id}第${fish_number_in_angler}尾，重量${weight}斤`)
    // 3) 计算净重：net_weight = weight – 6，插入 net_weights 表
    res.status(201).json({ /* 新记录 */ });
  } catch(err) { next(err); }
});

module.exports = router;

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