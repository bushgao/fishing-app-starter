const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const auth = require('./auth');
const anglersRouter = require('./anglers');
const positionsRouter = require('./positions');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const token = auth.generateToken({ username, role: 'admin' });
  res.json({ token, role: 'admin' });
});

// 钓友管理路由
app.use('/api/anglers', auth.verifyToken, anglersRouter);

// 分配钓位路由（手动填写）
app.use('/api/positions', auth.verifyToken, positionsRouter);

// 静态资源
app.use(express.static('public'));

// 初始化 DB 并启动服务
db.init();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);