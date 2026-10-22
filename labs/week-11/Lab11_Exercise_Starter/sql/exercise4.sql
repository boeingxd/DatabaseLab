-- =====================================================================
-- Lab 11 - Exercise 4 : JSON in practice
-- =====================================================================
USE lab11;

-- Step 1: add a JSON column called details to courses
ALTER TABLE courses ADD COLUMN details JSON;

-- Step 2: store a details object for every course. Course 4 uses a JSON
--         literal with an extra field "zoom" that the others don't have.
UPDATE courses SET details = JSON_OBJECT('room','BKD 3201','day','Mon','time','09:00',
       'online', false, 'tags', JSON_ARRAY('core','programming')) WHERE id = 1;
UPDATE courses SET details = JSON_OBJECT('room','BKD 3202','day','Tue','time','13:00',
       'online', false, 'tags', JSON_ARRAY('core','web')) WHERE id = 2;
UPDATE courses SET details = JSON_OBJECT('room','BKD 3203','day','Mon','time','13:00',
       'online', false, 'tags', JSON_ARRAY('core','theory')) WHERE id = 3;
UPDATE courses SET details =
  '{"room": "Online", "day": "Wed", "time": "10:00", "online": true,
    "zoom": "css-stat", "tags": ["math"]}'
 WHERE id = 4;
UPDATE courses SET details = JSON_OBJECT('room','BKD 3205','day','Thu','time','09:00',
       'online', false, 'tags', JSON_ARRAY('core','systems')) WHERE id = 5;

SELECT id, title, details FROM courses;

-- Step 3: return each course's title with its room and day (use ->>)
SELECT title, details->>'$.room' AS room, details->>'$.day' AS day FROM courses;

-- Step 4: only the courses that run on Monday (filter on a JSON field)
SELECT title, details->>'$.day' AS day FROM courses WHERE details->>'$.day' = 'Mon';

-- Step 5: compare -> and ->> on the tags array
SELECT title, details->'$.tags' AS tags, JSON_EXTRACT(details, '$.tags[0]') AS first_tag
  FROM courses;
