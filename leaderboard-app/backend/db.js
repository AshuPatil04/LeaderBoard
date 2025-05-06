const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0410',
  database: 'leaderboard_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected.');
});

module.exports = db;
