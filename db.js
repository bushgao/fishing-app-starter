const sqlite3 = require('sqlite3').verbose();
const dbName = 'fishing.db';
let db;

function init() {
  db = new sqlite3.Database(dbName, err => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
  });

  // 动态导出 db 实例，后续动态赋值
  module.exports.db = db;

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS anglers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER REFERENCES sessions(id),
      spot_number INTEGER,
      angler_id INTEGER,
      assigned_at DATETIME,
      UNIQUE(session_id, spot_number)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS catches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER,
      angler_id INTEGER,
      spot_number INTEGER,
      fish_number INTEGER,
      weight REAL,
      overall_count INTEGER,
      caught_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`
      CREATE TABLE IF NOT EXISTS billing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        catch_id INTEGER REFERENCES catches(id),
        net_weight REAL,
        fee REAL,
        settled_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });  // 结束 serialize 回调
} 
function all(sql, params, callback) {
  db.all(sql, params, callback);
}

module.exports = {
  init,
  all,
  db: undefined  // init 调用后会赋值
};