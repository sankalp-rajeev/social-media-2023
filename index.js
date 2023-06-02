
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false
}));




var con = require('./connection');
var bcrypt = require('bcrypt');
const multer = require("multer")
const fs = require("fs")
const util = require("util")
const sharp = require('sharp');

const unlinkFile = util.promisify(fs.unlink)

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).any()

function checkFileType(file, cb) {
    const fileTypes = /jpeg|png|jpg/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    }
    else {
        cb("Please upload correct file type")
    }
}

var con = require('./connection');
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(express.static('files'));

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")

app.get('/', function (req, res,) {
    res.sendFile(__dirname + '/signup.html');
});

app.get('/signup.html', function (req, res,) {
    res.sendFile(__dirname + '/signup.html');
});

app.get('/index.html', function (req, res,) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/explore.html', function (req, res) {
    res.sendFile(__dirname + '/explore.html');
});


app.get('/loginerror.html', function (req, res,) {
    res.sendFile(__dirname + '/loginerror.html');
});

app.get('/album.html', function (req, res,) {
    res.sendFile(__dirname + '/album.html');
});

app.get('/albumpics.html', function (req, res,) {
    res.sendFile(__dirname + '/albumpics.html');
});

app.get('/pic.html', function (req, res,) {
    res.sendFile(__dirname + '/pic.html');
});

app.get('/search.html', function (req, res,) {
    res.sendFile(__dirname + '/search.html');
});

app.get('/user.html', function (req, res,) {
    res.sendFile(__dirname + '/user.html');
});

app.get('/profile.ejs', (req, res) => {
    // Ensure user is logged in by checking if user_id is in the session
    if (!req.session.user_id) {
        res.redirect('/login');
        return;
    }

    // Render the homepage EJS template and pass the user_id
    res.render('profile', { user_id: req.session.user_id });
});



// app.get('/profile.ejs', function (req, res,) {
//     res.sendFile(__dirname + '/profile.ejs');
// });

app.get('/photos.ejs', function (req, res) {
    con.query("SELECT photo_id FROM photos", (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        } else {
            const photoIds = result.map(row => row.photo_id);
            // res.render(__dirname + '/photos.ejs', { photoIds: photoIds });
            res.render(__dirname + '/photos.ejs', { photo_ids: photoIds });

        }
    });
});


app.get('/album.html', function (req, res,) {
    res.sendFile(__dirname + '/album.html');
});

app.get('/search.html', function (req, res,) {
    res.sendFile(__dirname + '/search.html');
});


app.get('/addTags', function (req, res) {
    res.render(__dirname + '/photos.ejs');
});

app.get('/profile/:user_id', function (req, res) {
    const user_id = req.params.user_id;
    if (!user_id) {
        res.status(401).send("Unauthorized login page");
        return;
    }

    // Query user data from the database
    const sql = "SELECT first_name, last_name FROM users WHERE user_id = ?";
    con.query(sql, [user_id], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error fetching user data");
        } else if (result.length === 0) {
            res.status(404).send("User not found");
        } else {
            const user = result[0];

            // Query followers and following data from the database
            const sqlFollowers = `
                SELECT (
                    SELECT COUNT(*) FROM friends
                    WHERE user_id = ?
                ) AS followers,
                (
                    SELECT COUNT(*) FROM friends
                    WHERE friend_id = ?
                ) AS following
            `;
            con.query(sqlFollowers, [user_id, user_id], (error, result) => {
                if (error) {
                    console.error(error);
                    res.status(500).send("Error fetching followers and following data");
                } else {
                    const followersData = result[0];

                    // Query followers list from the database
                    const sqlFollowersList = `
                        SELECT u.first_name, u.last_name
                        FROM friends f
                        JOIN users u ON f.friend_id = u.user_id
                        WHERE f.user_id = ?
                    `;
                    con.query(sqlFollowersList, [user_id], (error, followersList) => {
                        if (error) {
                            console.error(error);
                            res.status(500).send("Error fetching followers list");
                        } else {
                            // Query top contribution score from the database
                            const sqlTopContributors = `
                            SELECT u.user_id, CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                            COALESCE(photo_count, 0) + COALESCE(comment_count, 0) AS contribution
                     FROM users u
                     LEFT JOIN (
                         SELECT a.owner_id, COUNT(p.photo_id) AS photo_count
                         FROM photos p
                         JOIN albums a ON p.album_id = a.album_id
                         GROUP BY a.owner_id
                     ) pc ON u.user_id = pc.owner_id
                     LEFT JOIN (
                         SELECT c.owner_id, COUNT(c.comment_id) AS comment_count
                         FROM comments c
                         GROUP BY c.owner_id
                     ) cc ON u.user_id = cc.owner_id
                     ORDER BY contribution DESC
                     LIMIT 10;
                     
                            
                            `;
                            con.query(sqlTopContributors, (error, topContributors) => {
                                if (error) {
                                    console.error(error);
                                    res.status(500).send("Error fetching top contributors data");
                                } else {
                                    res.render(__dirname + '/profile.ejs', {
                                        user_name: `${user.first_name} ${user.last_name}`,
                                        followers: followersData.followers,
                                        following: followersData.following,
                                        followersList: followersList,
                                        topContributors: topContributors
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});



app.post('/index.html', function (req, res) {
    var logemail = req.body.email;
    var logpassword = req.body.password;
    con.connect(function (error) {
        if (error) throw error;
        var sql_1 = "SELECT user_id, email, hashed_password  FROM users WHERE email = ?";


        con.query(sql_1, logemail, async function (error, result) {
            if (error) throw error;
            var pass = result[0].hashed_password;
            console.log(result)
            if (await bcrypt.compare(logpassword, pass)) {

                req.session.user_id = result[0].user_id; // Save user_id in the session
                res.redirect('/explore.html');
            } else {
                res.redirect('/loginerror.html');
            }
        });
    });
});


app.post('/', async function (req, res) {
    var f_name = req.body.first;
    var l_name = req.body.last;
    var email = req.body.email;
    var dob = req.body.dob;
    var h_town = req.body.hometown;
    var u_gender = req.body.gender;
    var u_pass = req.body.password.toString();

    var salt = await bcrypt.genSalt(5);
    var encrypt_pass = await bcrypt.hash(u_pass, salt);

    con.connect(function (error) {
        if (error) throw error;
        var sql_1 = "INSERT INTO users(first_name, last_name, email, date_of_birth, hometown, gender, hashed_password) VALUES ?";
        var vals = [
            [f_name, l_name, email, dob, h_town, u_gender, encrypt_pass]
        ];

        con.query(sql_1, [vals], function (error, result) {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') { // check if error is due to duplicate email
                    return res.send('<script>alert("This email is already registered. Please use a different email."); window.location.href = "/signup.html";</script>');
                }
                else {
                    throw error;
                }
            }

            console.log('User added successfully ' + result.insertId);
            res.send('<script>alert("User registered successfully!"); window.location.href = "/explore.html";</script>');
        });
    });
});

app.get('/popular-tags', (req, res) => {
    const query = `
      SELECT tags.tag_name, COUNT(*) AS tag_count
      FROM tags
      INNER JOIN photo_tags ON tags.tag_id = photo_tags.tag_id
      GROUP BY tags.tag_name
      ORDER BY tag_count DESC;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching popular tags');
        } else {
            res.json(results);
        }
    });
});

function addToSelectedTags(tag) {
    const selectedTagsInput = document.getElementById("selected-tags");
    const selectedTags = selectedTagsInput.value ? selectedTagsInput.value.split(",") : [];
    selectedTags.push(tag);
    selectedTagsInput.value = selectedTags.join(",");
}

// tags -- to send tag data to the server
app.post('/addTags', function (req, res) {
    var tags = req.body.tagName
    con.connect(function (error) {
        if (error) throw error;
        sql_2 = "INSERT INTO tags(tag_name) VALUES ?";
        var vals2 = [
            [tags]
        ];

        con.query(sql_2, [vals2], function (error, result) {
            if (error) throw error;
            console.log('Tag added successfully ' + result.insertId);
            // res.redirect('/explore.html');
        });
    })

})

app.post("/upload", (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Handle upload errors
            res.statusMessage = (err == "Please upload images only") ? err : "Photo exceed limit of 1 MB";
            res.status(400).end();
        } else if (req.files.length == 0) {
            // Handle the case where no files are selected
            res.statusMessage = "Please select an image to upload";
            res.status(400).end();
        } else {
            try {
                // Save images to the database
                const files = req.files;
                for (let file of files) {
                    // You can change the album_id and caption as needed
                    const album_id = 33;
                    const caption = 'Some caption';
                    const imageData = file.buffer;

                    // Resize and/or compress the image
                    const resizedImageData = await sharp(imageData)
                        .resize({ width: 800, height: 800, fit: 'inside' }) // Adjust the width and height as needed
                        .jpeg({ quality: 80 }) // Adjust the quality as needed (0-100)
                        .toBuffer();

                    const sql = "INSERT INTO photos (album_id, caption, data) VALUES (?, ?, ?)";
                    await new Promise((resolve, reject) => {
                        con.query(sql, [album_id, caption, resizedImageData], (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                console.log(`Image '${file.originalname}' saved to the database with photo_id: ${result.insertId}`);
                                resolve();
                            }
                        });
                    });
                }

                res.status(200).send();


            } catch (error) {
                console.error(error);
                res.statusMessage = "Error saving the images to the database";
                res.status(500).end();
            }
        }
    });
});

app.post("/upload/MyPhotos", (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Handle upload errors
            res.statusMessage = (err == "Please upload images only") ? err : "Photo exceed limit of 1 MB";
            res.status(400).end();
        } else if (req.files.length == 0) {
            // Handle the case where no files are selected
            res.statusMessage = "Please select an image to upload";
            res.status(400).end();
        } else {
            try {
                // Save images to the database
                const files = req.files;
                for (let file of files) {
                    // You can change the album_id and caption as needed
                    const album_id = 10; // Change to the album_id of MyPhotos
                    const caption = 'Some caption';
                    const imageData = file.buffer;

                    // Resize and/or compress the image
                    const resizedImageData = await sharp(imageData)
                        .resize({ width: 800, height: 800, fit: 'inside' }) // Adjust the width and height as needed
                        .jpeg({ quality: 80 }) // Adjust the quality as needed (0-100)
                        .toBuffer();

                    const sql = "INSERT INTO photos (album_id, caption, data) VALUES (?, ?, ?)";
                    await new Promise((resolve, reject) => {
                        con.query(sql, [album_id, caption, resizedImageData], (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                console.log(`Image '${file.originalname}' saved to the database with photo_id: ${result.insertId}`);
                                resolve();
                            }
                        });
                    });
                }

                res.status(200).send();


            } catch (error) {
                console.error(error);
                res.statusMessage = "Error saving the images to the database";
                res.status(500).end();
            }
        }
    });
});





app.get("/image/:photo_id", (req, res) => {
    const photo_id = req.params.photo_id;

    con.query("SELECT data FROM photos WHERE photo_id = ?", [photo_id], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error retrieving the image from the database");
        } else if (result.length === 0) {
            res.status(404).send("Image not found");
        } else {
            const imageData = result[0].data;
            res.contentType("image/jpeg");
            res.send(imageData);
        }
    });
});


app.delete("/deletePhoto/:photo_id", (req, res) => {
    const photo_id = req.params.photo_id;

    if (!photo_id) {
        res.statusMessage = "Please provide a photo ID to delete";
        res.status(400).end();
        return;
    }

    con.query("DELETE FROM photos WHERE photo_id = ?", [photo_id], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send("Error deleting the image from the database");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Image not found");
        } else {
            console.log(`Deleted image with photo_id: ${photo_id} from the database`);
            res.status(200).send("Image deleted successfully");
        }
    });
});


// app.post('/search.html', async function (req, res) {
//     var s_input = "%" + req.body.search_word + "%";
//     var type = req.body.search_type;
//     var query;

//     var queries = [
//         s_input,
//         s_input
//     ];

//     con.connect(function (error) {
//         if (error) throw error;
//         if (type == "user") {
//             query = "SELECT first_name, last_name, email  FROM users WHERE first_name LIKE ? OR last_name LIKE ?";
//             con.query(query, queries, function (error, result) {
//                 if (error) throw error;
//                 if (result[0] != undefined) {
//                     var i = 0;
//                     var s_results = "";
//                     while (result[i] != undefined) {
//                         s_results += "User: " + result[i].first_name + " " + result[i].last_name + " Email: " + result[i].email + "\n";
//                         i++;
//                     }
//                     res.status(200).send(s_results);
//                 } else {
//                     res.status(500).send("Error: User doesn't exist.");
//                 }
//             });
//         } else if (type == "photo") {
//             // query = "SELECT DISTINCT p.* FROM photos p JOIN photo_tags pt1 ON pt1.photo_id = p.photo_id AND pt1.tag_id = (SELECT tag_id FROM tags WHERE tag_name LIKE ?)";
//             var owner_id = req.session.user_id;
//             query = `SELECT photos.photo_id, photos.caption
//             FROM photos
//             INNER JOIN photo_tags ON photos.photo_id = photo_tags.photo_id
//             INNER JOIN tags ON photo_tags.tag_id = tags.tag_id
//             WHERE tags.tag_name = ? 
//             AND photos.album_id IN (
//               SELECT album_id
//               FROM albums
//               WHERE owner_id = ?
//             );`
//             con.query(query, [s_input, owner_id], function (error, result) {
//                 if (error) throw error;
//                 console.log(result);
//                 if (result[0] != undefined) {
//                     var i = 0;
//                     var s_results = "";
//                     while (result[i] != undefined) {
//                         s_results += "photo: " + result[i].caption + "\n"; // Fix here
//                         i++;
//                     }
//                     res.status(200).send(s_results);
//                 } else {
//                     res.status(500).send("Error: No photos contain that tag.");
//                 }
//             });
//         }
//     });
// });

app.post('/search.html', async function (req, res) {
    var s_input = "%" + req.body.search_word + "%";
    var type = req.body.search_type;
    var query;

    var queries = [
        s_input,
        s_input
    ];

    con.connect(function (error) {
        if (error) throw error;
        if (type == "user") {
            query = "SELECT first_name, last_name, email  FROM users WHERE first_name LIKE ? OR last_name LIKE ?";
            con.query(query, queries, function (error, result) {
                if (error) throw error;
                if (result[0] != undefined) {
                    var i = 0;
                    var s_results = "";
                    while (result[i] != undefined) {
                        s_results += "User: " + result[i].first_name + " " + result[i].last_name + " Email: " + result[i].email + "\n";
                        i++;
                    }
                    res.status(200).send(s_results);
                } else {
                    res.status(500).send("Error: User doesn't exist.");
                }
            });
        } else if (type == "photo") {
            query = "SELECT DISTINCT p.* FROM photos p JOIN photo_tags pt1 ON pt1.photo_id = p.photo_id AND pt1.tag_id = (SELECT tag_id FROM tags WHERE tag_name LIKE ?)";
            con.query(query, s_input, function (error, result) {
                if (error) throw error;
                console.log(result);
                if (result[0] != undefined) {
                    var i = 0;
                    var s_results = "";
                    while (result[i] != undefined) {
                        s_results += "photo: " + result[i].data + "\n";
                        i++;
                    }
                    res.status(200).send(s_results);
                } else {
                    res.status(500).send("Error: No photos contain that tag.");
                }
            });
        }
    });
});

app.listen(8080, () => console.log('Server Started'));