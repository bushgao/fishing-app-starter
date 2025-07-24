/**
 * @file routes/sessions.js
 * @description 比赛场次（Session）管理
 *
 * @route GET    /api/sessions             获取所有场次
 * @route GET    /api/sessions/:id         获取指定场次
 * @route POST   /api/sessions             新建场次（包括钓友+钓位）
 *   body: { name, start_time, end_time, anglers: [id,…], positions: [id,…] }
 * @route PUT    /api/sessions/:id         更新场次信息
 * @route DELETE /api/sessions/:id         删除场次
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', /* … */);
router.get('/:id', /* … */);
router.post('/', /* 插入 sessions，并批量插入 session_anglers, session_positions */);
router.put('/:id', /* … */);
router.delete('/:id', /* … */);

module.exports = router;

// sessions.js
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
