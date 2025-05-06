// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '0410',
//     database: 'leaderboard_db'
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('MySQL connection error:', err);
//         process.exit(1);
//     }
//     console.log('MySQL connected.');

//     // Insert users
//     const users = [
//         { full_name: 'John Doe', email: 'john@example.com' },
//         { full_name: 'Jane Smith', email: 'jane@example.com' },
//         { full_name: 'Alice Johnson', email: 'alice@example.com' },
//         { full_name: 'Bob Brown', email: 'bob@example.com' }
//     ];

//     connection.query('INSERT INTO users (full_name, email) VALUES ?', [users.map(u => [u.full_name, u.email])], (err) => {
//         if (err) {
//             console.error('Error inserting users:', err);
//             throw err;
//         }
//         console.log('Users inserted.');

//         // Insert activities
//         const activities = [
//             { user_id: 1, points: 20, performed_at: '2025-05-06 08:00:00' },
//             { user_id: 1, points: 20, performed_at: '2025-05-06 09:00:00' },
//             { user_id: 2, points: 20, performed_at: '2025-05-06 10:00:00' },
//             { user_id: 3, points: 20, performed_at: '2025-05-05 11:00:00' },
//             { user_id: 4, points: 20, performed_at: '2025-04-01 12:00:00' }
//         ];

//         connection.query('INSERT INTO user_activities (user_id, points, performed_at) VALUES ?', [activities.map(a => [a.user_id, a.points, a.performed_at])], (err) => {
//             if (err) {
//                 console.error('Error inserting activities:', err);
//                 throw err;
//             }
//             console.log('Activities inserted.');

//             // Populate leaderboard without GROUP BY
//             connection.query(`
//                 INSERT INTO leaderboard (user_id, full_name, total_points)
//                 SELECT u.id, u.full_name, 0
//                 FROM users u
//                 ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)
//             `, (err) => {
//                 if (err) {
//                     console.error('Error initializing leaderboard:', err);
//                     throw err;
//                 }

//                 connection.query(`
//                     UPDATE leaderboard l
//                     SET total_points = (
//                         SELECT COALESCE(SUM(ua.points), 0)
//                         FROM user_activities ua
//                         WHERE ua.user_id = l.user_id
//                     )
//                 `, (err) => {
//                     if (err) {
//                         console.error('Error updating leaderboard points:', err);
//                         throw err;
//                     }
//                     console.log('Leaderboard points updated.');

//                     connection.query('CALL UpdateLeaderboardRanks()', (err) => {
//                         if (err) {
//                             console.error('Error updating ranks:', err);
//                             throw err;
//                         }
//                         console.log('Ranks updated.');
//                         connection.end();
//                     });
//                 });
//             });
//         });
//     });
// });

const mysql = require('mysql');
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

    // Disable foreign key checks to allow truncation
    connection.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
        if (err) {
            console.error('Error disabling foreign key checks:', err);
            throw err;
        }

        // Truncate tables to clear existing data
        connection.query('TRUNCATE TABLE leaderboard', (err) => {
            if (err) {
                console.error('Error truncating leaderboard:', err);
                throw err;
            }
            connection.query('TRUNCATE TABLE user_activities', (err) => {
                if (err) {
                    console.error('Error truncating user_activities:', err);
                    throw err;
                }
                connection.query('TRUNCATE TABLE users', (err) => {
                    if (err) {
                        console.error('Error truncating users:', err);
                        throw err;
                    }

                    // Re-enable foreign key checks
                    connection.query('SET FOREIGN_KEY_CHECKS = 1', (err) => {
                        if (err) {
                            console.error('Error enabling foreign key checks:', err);
                            throw err;
                        }

                        // Insert users
                        const users = [
                            { full_name: 'John Doe', email: 'john@example.com' },
                            { full_name: 'Jane Smith', email: 'jane@example.com' },
                            { full_name: 'Alice Johnson', email: 'alice@example.com' },
                            { full_name: 'Bob Brown', email: 'bob@example.com' }
                        ];

                        connection.query('INSERT INTO users (full_name, email) VALUES ?', [users.map(u => [u.full_name, u.email])], (err) => {
                            if (err) {
                                console.error('Error inserting users:', err);
                                throw err;
                            }
                            console.log('Users inserted.');

                            // Insert activities
                            const activities = [
                                { user_id: 1, points: 20, performed_at: '2025-05-06 08:00:00' },
                                { user_id: 1, points: 20, performed_at: '2025-05-06 09:00:00' },
                                { user_id: 2, points: 20, performed_at: '2025-05-06 10:00:00' },
                                { user_id: 3, points: 20, performed_at: '2025-05-05 11:00:00' },
                                { user_id: 4, points: 20, performed_at: '2025-04-01 12:00:00' }
                            ];

                            connection.query('INSERT INTO user_activities (user_id, points, performed_at) VALUES ?', [activities.map(a => [a.user_id, a.points, a.performed_at])], (err) => {
                                if (err) {
                                    console.error('Error inserting activities:', err);
                                    throw err;
                                }
                                console.log('Activities inserted.');

                                // Populate leaderboard without GROUP BY
                                connection.query(`
                                    INSERT INTO leaderboard (user_id, full_name, total_points)
                                    SELECT u.id, u.full_name, 0
                                    FROM users u
                                    ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)
                                `, (err) => {
                                    if (err) {
                                        console.error('Error initializing leaderboard:', err);
                                        throw err;
                                    }

                                    connection.query(`
                                        UPDATE leaderboard l
                                        SET total_points = (
                                            SELECT COALESCE(SUM(ua.points), 0)
                                            FROM user_activities ua
                                            WHERE ua.user_id = l.user_id
                                        )
                                    `, (err) => {
                                        if (err) {
                                            console.error('Error updating leaderboard points:', err);
                                            throw err;
                                        }
                                        console.log('Leaderboard points updated.');

                                        connection.query('CALL UpdateLeaderboardRanks()', (err) => {
                                            if (err) {
                                                console.error('Error updating ranks:', err);
                                                throw err;
                                            }
                                            console.log('Ranks updated.');
                                            connection.end();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});