const db = require('./db');

const users = [['John Doe'], ['Jane Smith'], ['Alice Cooper']];
const insertUsers = 'INSERT INTO users (full_name) VALUES ?';

db.query(insertUsers, [users], (err, res) => {
  if (err) throw err;
  console.log('Users added');

  const activities = [];
  for (let i = 1; i <= 3; i++) {
    for (let j = 0; j < 5; j++) {
      activities.push([i, new Date(), 20]);
    }
  }

  const insertActivities = 'INSERT INTO user_activities (user_id, performed_at, points) VALUES ?';
  db.query(insertActivities, [activities], (err2) => {
    if (err2) throw err2;
    console.log('Activities added');
  });
});
