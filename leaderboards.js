/**
 * @file routes/leaderboards.js
 * @description 排行榜和数据汇总
 *
 * @route GET /api/leaderboards/:sessionId/tails       本场次个人尾数排行
 * @route GET /api/leaderboards/:sessionId/max-weight  本场次最大单尾重排行
 * @route GET /api/leaderboards/:sessionId/total-weight 本场次累计重量排行
 *
 * @route GET /api/leaderboards/summary/daily   单日汇总排行
 * @route GET /api/leaderboards/summary/weekly  周汇总排行
 * @route GET /api/leaderboards/summary/monthly 月汇总排行
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:sessionId/tails', /* … */);
router.get('/:sessionId/max-weight', /* … */);
router.get('/:sessionId/total-weight', /* … */);

router.get('/summary/daily', /* 分组聚合当天数据 */);
router.get('/summary/weekly', /* 分组聚合周数据 */);
router.get('/summary/monthly', /* 分组聚合月数据 */);

module.exports = router;
