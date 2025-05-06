const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0410',
  database: 'leaderboard_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Define a route to fetch the leaderboard
app.get('/leaderboard', (req, res) => {
  const userId = req.query.user_id || null;  // Get user_id from query parameter
  
  // Define the SQL query to fetch leaderboard data
  const sql = `
    SELECT 
      l.user_id, 
      u.full_name, 
      IFNULL(SUM(ua.points), 0) AS total_points,
      RANK() OVER (ORDER BY IFNULL(SUM(ua.points), 0) DESC) AS rank
    FROM 
      users u
    JOIN 
      leaderboard l ON u.id = l.user_id
    LEFT JOIN 
      user_activities ua ON ua.user_id = u.id
    WHERE 
      (ua.activity_date BETWEEN '2025-05-01' AND '2025-05-06' OR ua.activity_date IS NULL)
      AND (l.user_id = ? OR ? IS NULL)
    GROUP BY 
      u.id
    ORDER BY 
      total_points DESC;
  `;

  // Run the query
  connection.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    // Send the results as a response
    res.json(results);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
