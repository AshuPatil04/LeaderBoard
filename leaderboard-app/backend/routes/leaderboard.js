const express = require('express');
const router = express.Router();
const db = require('../db');

// Recalculate leaderboard
router.post('/recalculate', (req, res) => {
  const deleteSql = `DELETE FROM leaderboard`;
  db.query(deleteSql, (err) => {
    if (err) return res.status(500).json(err);

    const insertSql = `
      INSERT INTO leaderboard (user_id, full_name, total_points, rank)
      SELECT 
        ua.user_id,
        u.full_name,
        SUM(ua.points) AS total_points,
        RANK() OVER (ORDER BY SUM(ua.points) DESC) AS rank
      FROM user_activities ua
      JOIN users u ON ua.user_id = u.id
      GROUP BY ua.user_id
    `;

    db.query(insertSql, (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: 'Leaderboard recalculated' });
    });
  });
});

// Get leaderboard with optional filters
router.get('/', (req, res) => {
  const { filter, search } = req.query;
  let condition = '';
  if (filter === 'day') condition = 'AND DATE(performed_at) = CURDATE()';
  if (filter === 'month') condition = 'AND MONTH(performed_at) = MONTH(CURDATE())';
  if (filter === 'year') condition = 'AND YEAR(performed_at) = YEAR(CURDATE())';

  let sql = `
    SELECT l.user_id, l.full_name, l.total_points, l.rank 
    FROM leaderboard l
    JOIN (
      SELECT user_id, SUM(points) as total_points
      FROM user_activities
      WHERE 1=1 ${condition}
      GROUP BY user_id
    ) a ON l.user_id = a.user_id
    ORDER BY l.total_points DESC
  `;

  if (search) {
    sql = `
      SELECT * FROM leaderboard WHERE user_id = ${db.escape(search)}
      UNION
      ${sql}
    `;
  }

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;
