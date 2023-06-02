drop database if exists application_schema;
create database application_schema;
use application_schema;
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  hometown VARCHAR(50),
  gender ENUM('Male', 'Female', 'Other'),
  hashed_password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS albums (
  album_id INT AUTO_INCREMENT PRIMARY KEY,
  album_name VARCHAR(50) NOT NULL,
  owner_id INT NOT NULL,
  date_of_creation DATE NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(user_id)
  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT NOT NULL,
  caption VARCHAR(255) NOT NULL,
  data BLOB NOT NULL,
  FOREIGN KEY (album_id) REFERENCES albums(album_id)
  ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS photo_tags (
  photo_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (photo_id, tag_id),
  FOREIGN KEY (photo_id) REFERENCES photos(photo_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
);

CREATE TABLE IF NOT EXISTS comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  owner_id INT NOT NULL,
  photo_id INT NOT NULL,
  date_created DATETIME NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(user_id),
  FOREIGN KEY (photo_id) REFERENCES photos(photo_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friends (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  date_formed DATETIME NOT NULL,
  PRIMARY KEY (user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (friend_id) REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
  like_ct INT NOT NULL DEFAULT 0,
  user_id INT NOT NULL,
  photo_id INT NOT NULL,
  PRIMARY KEY (user_id, photo_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (photo_id) REFERENCES photos(photo_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- when a user likes a particular post
UPDATE likes
SET like_ct = like_ct + 1
WHERE user_id = '<photo_id>'; -- '<photo_id>' is a place holder
-- when a user dislikes a particular post
UPDATE likes
SET like_ct = like_ct - 1
WHERE user_id = '<photo_id>'; -- '<photo_id>' is a place holder
