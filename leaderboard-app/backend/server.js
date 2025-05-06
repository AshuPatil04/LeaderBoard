const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0410',
    database: 'leaderboard_db'
});

connection.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
    }
    console.log('MySQL connected.');
});

// Get leaderboard with optional filtering and search
app.get('/api/leaderboard', (req, res) => {
    const { period, userId } = req.query;
    let filterClause = '';
    if (period === 'day') {
        filterClause = 'AND DATE(ua.performed_at) = CURDATE()';
    } else if (period === 'month') {
        filterClause = 'AND YEAR(ua.performed_at) = YEAR(CURDATE()) AND MONTH(ua.performed_at) = MONTH(CURDATE())';
    } else if (period === 'year') {
        filterClause = 'AND YEAR(ua.performed_at) = YEAR(CURDATE())';
    }

    const query = userId
        ? `
            SELECT l.user_id, l.full_name, l.total_points, l.rank 
            FROM leaderboard l
            WHERE l.user_id = ?
            UNION
            SELECT l.user_id, l.full_name, l.total_points, l.rank 
            FROM leaderboard l
            LEFT JOIN user_activities ua ON l.user_id = ua.user_id
            WHERE ua.user_id IS NULL OR (ua.user_id = l.user_id ${filterClause})
            ORDER BY total_points DESC, user_id ASC
        `
        : `
            SELECT l.user_id, l.full_name, l.total_points, l.rank 
            FROM leaderboard l
            LEFT JOIN user_activities ua ON l.user_id = ua.user_id
            WHERE ua.user_id IS NULL OR (ua.user_id = l.user_id ${filterClause})
            ORDER BY total_points DESC, user_id ASC
        `;

    connection.query(query, userId ? [userId] : [], (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Recalculate leaderboard
app.post('/api/recalculate', (req, res) => {
    const newActivity = {
        user_id: Math.floor(Math.random() * 4) + 1,
        points: 20,
        performed_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    connection.query(
        'INSERT INTO user_activities (user_id, points, performed_at) VALUES (?, ?, ?)', 
        [newActivity.user_id, newActivity.points, newActivity.performed_at], 
        (err) => {
            if (err) {
                console.error('Insert error:', err);
                return res.status(500).json({ error: err.message });
            }

            // Update total_points without GROUP BY
            connection.query(`
                UPDATE leaderboard l
                SET total_points = (
                    SELECT COALESCE(SUM(ua.points), 0)
                    FROM user_activities ua
                    WHERE ua.user_id = l.user_id
                )
            `, (err) => {
                if (err) {
                    console.error('Update error:', err);
                    return res.status(500).json({ error: err.message });
                }

                connection.query('CALL UpdateLeaderboardRanks()', (err) => {
                    if (err) {
                        console.error('Rank error:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Leaderboard recalculated.' });
                });
            });
        }
    );
});

// Handle unexpected requests
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
