-- Test Data Insert Script for Leaderboard Pagination Testing
-- This script adds 15 test records with varying completion times

INSERT INTO leaderboard (player_name, total_time, task_times, created_at, completed_at, date) VALUES
-- Fast completions (under 5 minutes)
('Speed Runner', 180000, '{"1": 30000, "2": 25000, "3": 20000, "4": 35000, "5": 15000, "6": 25000, "7": 20000, "8": 15000}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', (NOW() - INTERVAL '1 day')::date),
('Quick Learner', 240000, '{"1": 40000, "2": 30000, "3": 25000, "4": 40000, "5": 20000, "6": 30000, "7": 25000, "8": 20000}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', (NOW() - INTERVAL '2 days')::date),
('Fast Track', 300000, '{"1": 45000, "2": 35000, "3": 30000, "4": 45000, "5": 25000, "6": 35000, "7": 30000, "8": 25000}', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', (NOW() - INTERVAL '3 days')::date),

-- Medium completions (5-10 minutes)
('Steady Eddie', 360000, '{"1": 50000, "2": 40000, "3": 35000, "4": 50000, "5": 30000, "6": 40000, "7": 35000, "8": 30000}', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', (NOW() - INTERVAL '4 days')::date),
('Methodical Mike', 420000, '{"1": 55000, "2": 45000, "3": 40000, "4": 55000, "5": 35000, "6": 45000, "7": 40000, "8": 35000}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', (NOW() - INTERVAL '5 days')::date),
('Careful Carol', 480000, '{"1": 60000, "2": 50000, "3": 45000, "4": 60000, "5": 40000, "6": 50000, "7": 45000, "8": 40000}', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', (NOW() - INTERVAL '6 days')::date),
('Thoughtful Tom', 540000, '{"1": 65000, "2": 55000, "3": 50000, "4": 65000, "5": 45000, "6": 55000, "7": 50000, "8": 45000}', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', (NOW() - INTERVAL '7 days')::date),
('Patient Pete', 600000, '{"1": 70000, "2": 60000, "3": 55000, "4": 70000, "5": 50000, "6": 60000, "7": 55000, "8": 50000}', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', (NOW() - INTERVAL '8 days')::date),

-- Slower completions (10-15 minutes)
('Slow and Steady', 660000, '{"1": 75000, "2": 65000, "3": 60000, "4": 75000, "5": 55000, "6": 65000, "7": 60000, "8": 55000}', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days', (NOW() - INTERVAL '9 days')::date),
('Cautious Kate', 720000, '{"1": 80000, "2": 70000, "3": 65000, "4": 80000, "5": 60000, "6": 70000, "7": 65000, "8": 60000}', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', (NOW() - INTERVAL '10 days')::date),
('Deliberate Dan', 780000, '{"1": 85000, "2": 75000, "3": 70000, "4": 85000, "5": 65000, "6": 75000, "7": 70000, "8": 65000}', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days', (NOW() - INTERVAL '11 days')::date),
('Careful Connie', 840000, '{"1": 90000, "2": 80000, "3": 75000, "4": 90000, "5": 70000, "6": 80000, "7": 75000, "8": 70000}', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', (NOW() - INTERVAL '12 days')::date),

-- Very slow completions (15+ minutes)
('Thorough Theo', 900000, '{"1": 95000, "2": 85000, "3": 80000, "4": 95000, "5": 75000, "6": 85000, "7": 80000, "8": 75000}', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days', (NOW() - INTERVAL '13 days')::date),
('Meticulous Mary', 960000, '{"1": 100000, "2": 90000, "3": 85000, "4": 100000, "5": 80000, "6": 90000, "7": 85000, "8": 80000}', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', (NOW() - INTERVAL '14 days')::date),
('Perfectionist Paul', 1020000, '{"1": 105000, "2": 95000, "3": 90000, "4": 105000, "5": 85000, "6": 95000, "7": 90000, "8": 85000}', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', (NOW() - INTERVAL '15 days')::date);

-- Verify the insertions
SELECT 
    id,
    player_name,
    total_time,
    ROUND(total_time / 60000.0, 2) as minutes,
    created_at
FROM leaderboard 
ORDER BY total_time ASC;
