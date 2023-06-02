-- Search for a user provided first name or last name

SELECT user_id, first_name, last_name, email, date_of_birth, hometown, gender
FROM users
WHERE first_name LIKE '%<user_name>%' OR last_name LIKE '%<user-name>%'; -- <user-name> is a place holder

-- Listing a user friends

SELECT u.user_id, u.first_name, u.last_name, u.email, u.date_of_birth, u.hometown, u.gender
FROM users u
JOIN friends f ON (u.user_id = f.friend_id OR u.user_id = f.user_id)
WHERE (f.user_id = '<user_id>' OR f.friend_id = '<user_id>') AND u.user_id <> '<user_id>';  -- '<user_id>' is a place holder

-- Top user contributions: shows the user activity in the system

SELECT u.user_id, CONCAT(u.first_name, ' ', u.last_name) AS full_name, COUNT(DISTINCT p.photo_id) + COUNT(DISTINCT c.comment_id) AS contribution
FROM users u
LEFT JOIN albums a ON u.user_id = a.owner_id
LEFT JOIN photos p ON a.album_id = p.album_id
LEFT JOIN comments c ON p.photo_id = c.photo_id
GROUP BY u.user_id
ORDER BY contribution DESC
LIMIT 10;

-- Browse users own albums and photos

SELECT albums.album_id, albums.album_name, albums.date_of_creation, photos.photo_id, photos.caption, photos.data
FROM albums
INNER JOIN photos ON albums.album_id = photos.album_id
WHERE albums.owner_id = '<owner_id>'; -- '<owner_id>' is a place holder

-- Browse all the photos

SELECT albums.album_id, albums.album_name, albums.date_of_creation, photos.photo_id, photos.caption, photos.data
FROM albums
INNER JOIN photos ON albums.album_id = photos.album_id;

-- Delete a photo from an album

DELETE FROM photos
-- '<photo_id>' and '<album_id>' is a place holder 
WHERE photo_id = '<photo_id>' AND album_id = '<album_id>' AND EXISTS ( 
  SELECT '<album_id>' FROM albums
  WHERE albums.album_id = photos.album_id AND albums.owner_id = '<owner_id>' -- '<owner_id>' is a place holder
);
DELETE FROM likes WHERE photo_id = '<photo_id>';
DELETE FROM comments WHERE photo_id = '<photo_id>';

-- Delete an album (considers the case where user can only delete albums owned by him)
DELETE FROM albums
-- '<album_id>' and '<owner_id>' is a place holder
WHERE album_id = '<album_id>' AND owner_id = '<owner_id>';

-- -----------------------------------------------------------------------------------------------------------------------------
-- View photo by tags
SELECT photos.photo_id, photos.caption, photos.data
FROM photos
INNER JOIN photo_tags ON photos.photo_id = photo_tags.photo_id
INNER JOIN tags ON photo_tags.tag_id = tags.tag_id
WHERE tags.tag_name = '<tag_name>' -- '<tag_name>' is a place holder
AND photos.album_id IN (
  SELECT album_id
  FROM albums
  WHERE owner_id = '<owner_id>'; -- '<owner_id>' is a place holder
);

-- to view only the current user's photos with a specific tag

SELECT photos.photo_id, photos.album_id, photos.caption, photos.data
FROM photos
JOIN photo_tags ON photos.photo_id = photo_tags.photo_id
JOIN tags ON photo_tags.tag_id = tags.tag_id
JOIN albums ON photos.album_id = albums.album_id
WHERE tags.tag_name = '<tag_name>' -- '<tag_name>' is a place holder
  AND albums.owner_id = '<owner_id>'; -- '<owner_id>' is a place holder

-- most popular tags

SELECT tags.tag_name, COUNT(*) AS tag_count
FROM tags
INNER JOIN photo_tags ON tags.tag_id = photo_tags.tag_id
GROUP BY tags.tag_name
ORDER BY tag_count DESC;

-- photo search 
SELECT DISTINCT p.*
FROM photos p
JOIN photo_tags pt1 ON pt1.photo_id = p.photo_id AND pt1.tag_id = (SELECT tag_id FROM tags WHERE tag_name = '<tag_name>') -- '<tag_name>' is a place holder
-- -------------------------------------------------------------------------------------------------------------------------------
JOIN photo_tags pt2 ON pt2.photo_id = p.photo_id AND pt2.tag_id = (SELECT tag_id FROM tags WHERE tag_name = '<tag_name>') -- '<tag_name>' is a place holder
WHERE p.album_id IN (
  SELECT album_id FROM albums WHERE owner_id = '<owner_id>' -- '<owner_id>' is a place holder
) ;
-- or remove this line to search all photos
-- -------------------------------------------------------------------------------------------------------------------------------

-- Reommendation for friends

SELECT  distinct u2.first_name, u2.last_name,u2.user_id
FROM friends f1
JOIN users u1 ON u1.user_id = f1.user_id
JOIN friends f2 ON f2.user_id = u1.user_id AND f2.friend_id <> f1.friend_id
JOIN users u2 ON u2.user_id = f2.friend_id
WHERE f1.friend_id = '<friend_id>' AND f2.friend_id NOT IN ( -- '<friend_id>' is a place holder
    SELECT friend_id
    FROM friends
    WHERE user_id = '<user_id>' -- '<user_id>' is a place holder
)
ORDER BY u2.last_name, u2.first_name;

-- you may also like functionality

SELECT p.*, COUNT(pt.tag_id) AS matched_tags 
FROM photos p
JOIN photo_tags pt ON p.photo_id = pt.photo_id
WHERE pt.tag_id IN (
  SELECT tag_id FROM photo_tags WHERE photo_id IN (
    SELECT photo_id FROM photos WHERE photo_id = 1
  )
  GROUP BY tag_id
  ORDER BY COUNT(*) DESC
  
)
GROUP BY p.photo_id
HAVING COUNT(pt.tag_id) >= 1
ORDER BY matched_tags DESC, COUNT(*)
LIMIT 10;

-- Like functionality, incrementing likes

UPDATE Likes
SET like_ct = like_ct + 1
WHERE Likes.photo_id = Photos.photo_id;

-- Search on comments
SELECT first_name, last_name
FROM users
JOIN (SELECT comments.text, comments.owner_id, COUNT(DISTINCT text) as count
	FROM comments
    WHERE text = '<comment_name>' -- '<comment_name>' is a place holder
    GROUP BY owner_id) a ON users.user_id = a.owner_id
    ORDER BY a.count DESC
