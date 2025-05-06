DELIMITER //

CREATE PROCEDURE UpdateLeaderboardRanks()
BEGIN
    CREATE TEMPORARY TABLE temp_leaderboard AS
    SELECT user_id, total_points
    FROM leaderboard
    ORDER BY total_points DESC;

    SET @rank = 0;
    SET @prev_points = NULL;

    UPDATE leaderboard l
    JOIN (
        SELECT user_id,
               @rank := IF(@prev_points = total_points, @rank, @rank + 1) AS new_rank,
               @prev_points := total_points
        FROM temp_leaderboard
    ) r ON l.user_id = r.user_id
    SET l.rank = r.new_rank;

    DROP TEMPORARY TABLE temp_leaderboard;
END //

DELIMITER ;