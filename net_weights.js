/**
 * @file routes/net_weights.js
 * @description 计算并存储每条鱼的净重
 *
 * @route GET    /api/net-weights/:sessionId     获取某场次净重记录
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:sessionId', async (req, res, next) => {
  // SELECT * FROM net_weights WHERE session_id = ?
});

module.exports = router;
