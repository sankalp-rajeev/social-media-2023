-- Sample data for users table
INSERT INTO users (first_name, last_name, email, date_of_birth, hometown, gender, hashed_password)
VALUES 
('Mike', 'Williams', 'mikewilliams@example.com', '1985-06-20', 'Chicago', 'Male', '4b4aa88f2c1d2'),
('Anna', 'Lee', 'annalee@example.com', '1998-11-03', 'San Francisco', 'Female', '8e13bc12aa55f'),
('David', 'Brown', 'davidbrown@example.com', '1992-04-10', 'Boston', 'Male', '3e9eaa3cfb4c8'),
('Emily', 'Johnson', 'emilyjohnson@example.com', '1994-07-18', 'Seattle', 'Female', '5d12f70c7e33b'),
('Peter', 'Davis', 'peterdavis@example.com', '1999-03-25', 'Miami', 'Male', 'f6b3ec6aee5f8'),
('Sophie', 'Clark', 'sophieclark@example.com', '1991-09-05', 'Dallas', 'Female', 'b5c5bb1ac9f11'),
('Kevin', 'Wang', 'kevinwang@example.com', '1997-12-11', 'Houston', 'Male', '1a6bb95ef527e'),
('Lucy', 'Garcia', 'lucygarcia@example.com', '1993-08-29', 'San Diego', 'Female', '9f8bd77d17c42');

-- Sample data for albums table
use application_schema;
INSERT INTO albums (name, owner_id, date_of_creation)
VALUES 
('MyPhotos', 1058, '2022-07-01'),
('Family Christmas 2021', 1058, '2021-12-25'),
('My Hometown', 1058, '2022-02-15'),
('Graduation Day', 1058, '2010-06-10'),
('Road Trip', 1095, '2021-08-10'),
('New Year Party 2023', 1094, '2023-01-01'),
('Beach Day', 1091, '2022-05-20'),
('Summer Memories', 1090, '2021-09-01'),
('Wedding Day', 1056, '2022-03-12'),
('Hiking Adventure', 1058, '2022-04-22'),
('Wedding Memories', 1058, '2022-06-18'),
('Beach Getaway', 1058, '2022-07-28'),
('City Exploration', 1058, '2022-05-07'),
('Snowy Retreat', 1095, '2022-01-20');

-- Sample data for photo table
INSERT INTO photos (album_id, caption, data)
VALUES (1, 'My first photo', '0x1234567890ABCDEF'),
       (1, 'Beautiful sunset', '0xFEDCBA0987654321'),
       (1, 'Cute puppy', '0x2468101214161820'),
       (2, 'Family vacation', '0x1122334455667788'),
       (2, 'Beach day', '0x9988776655443322'),
       (2, 'New car', '0x4444444444444444'),
       (3, 'City skyline', '0xABCDEF0123456789'),
       (3, 'Birthday party', '0x1234ABCD5678EFGH'),
       (3, 'Road trip', '0x5555555555555555'),
       (3, 'Hiking in the mountains', '0xBBBBBBBBBBBBBBBB');

-- Sample data for tags table
use application_schema;
INSERT INTO tags (tag_name) VALUES
('food'),
('travel'),
('technology'),
('health'),
('fashion'),
('sports'),
('music'),
('art'),
('books'),
('movies');

-- Sample data for photo_tags table
INSERT INTO photo_tags (photo_id, tag_id)
VALUES (66, 48),
       (67, 50),
       (69, 54),
       (69, 55),
       (66, 57),
       (70, 55),
       (74, 67),
       (70, 66),
       (66, 65),
       (74, 64);

-- Sample data for comment table	
INSERT INTO comments (text, owner_id, photo_id, date_created)
VALUES
('Beautiful picture!', 1, 66, NOW()),
('Nice shot!', 2,  70, NOW()),
('Love the colors!', 1058, 74, NOW()),
('Great composition!', 1057, 68, NOW()),
('Amazing work!', 1057, 71, NOW()),
('Stunning!', 1095, 69, NOW()),
('Awesome!', 1090, 74, NOW()),
('Well done!', 1094, 73, NOW()),
('Incredible!', 1056, 68, NOW()),
('Fantastic!', 1088, 74, NOW());

-- Sample data for friends table
INSERT INTO friends (user_id, friend_id, date_formed)
VALUES
(1058, 1, '2022-01-01 12:00:00'),
(1058, 1095, '2022-02-14 09:30:00'),
(1058, 1087, '2022-03-22 16:45:00'),
(1058, 1091, '2022-01-01 12:00:00'),
(1058, 1092, '2022-02-14 09:30:00'),
(1058, 1094, '2022-04-10 18:15:00'),
(1056, 1087, '2022-02-14 09:30:00'),
(1056, 1057, '2022-02-14 09:30:00'),
(1056, 1058, '2022-03-22 16:45:00'),
(1057, 1087, '2022-03-22 16:45:00');

-- Sample data for likes table
INSERT INTO likes (user_id, photo_id)
VALUES
  (1, 3),
  (2, 2),
  (3, 1),
  (4, 4),
  (5, 5),
  (6, 8),
  (7, 9),
  (8, 10),
  (9, 7),
  (10, 6);