const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'udemy-node',
    password:'hsua8*'
});

module.exports = pool.promise();