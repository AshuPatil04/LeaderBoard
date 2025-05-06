CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    points INT NOT NULL DEFAULT 20,
    performed_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    total_points INT NOT NULL DEFAULT 0,
    rank INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);