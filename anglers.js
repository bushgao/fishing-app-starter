/**
 * @file routes/anglers.js
 * @description 钓友（Angler）管理接口
 *
 * @route GET    /api/anglers            列表查询所有钓友
 * @route GET    /api/anglers/:id        查询单个钓友
 * @route POST   /api/anglers            新增单个钓友
 * @route PUT    /api/anglers/:id        修改钓友信息
 * @route DELETE /api/anglers/:id        删除钓友
 * @route POST   /api/anglers/import     EXCEL 批量导入钓友
 *   body: multipart/form-data, field='file'
 */
const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db');
const upload = multer({ dest: 'uploads/' });

router.get('/', /* … */);
router.get('/:id', /* … */);
router.post('/', /* … */);
router.put('/:id', /* … */);
router.delete('/:id', /* … */);

/**
 * POST /api/anglers/import
 * EXCEL 批量导入
 */
router.post('/import', upload.single('file'), async (req, res, next) => {
  // Copilot：解析 XLSX，循环插入 anglers 表
});

module.exports = router;
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