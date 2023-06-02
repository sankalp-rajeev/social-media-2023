var mysql = require('mysql2');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'application_schema'
})

module.exports = con;


