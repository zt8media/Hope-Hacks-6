const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const exp = require('constants');
require('dotenv').config();



const app = express();

// app.use(express.static('public'));
app.use(express.json());
app.use('', express.static('public'));
app.use('/admin', (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;

    console.log(username, password);

    if (!username || !password) {
        res.status(403).send("Unauthorized");
    }

    connection.query(
        `call findAdmin('${username}', '${password}')`,
        (err, results) => {
            if (err || !username || !password || !results) {
                res.status(403).send("Unauthorized");
            } else if (results[0].length > 0) {
                    console.log(results);
                    next();
            }
        }
    );
});
app.use('/admin', express.static('admin'));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    connection.query(
        `call login('${username}', '${password}')`,
        (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        }
    );
});

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        `call findUser('${username}')`,
        (err, results) => {
            if (err) {
                res.send(err);
            } else {
                if (results.length > 0) {
                    res.send('User already exists');
                } else {
                    connection.query(
                        `call signup('${username}', '${password}')`,
                        (err, results) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(results);
                            }
                        }
                    );
                }
            }
        }
    );
});

app.get('/admin/adminGetUser', (req, res) => {
    const searchUsername = req.query.searchUsername;
    const username = req.query.username;
    const password = req.query.password;

    connection.query(
        `call findAdmin('${username}', '${password}')`,
        (err, results) => {
            if (err) {
                res.send(err);
            } else {
                if (results.length > 0) {
                    connection.query(
                        `call findUser('${searchUsername}')`,
                        (err, results) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(results);
                            }
                        }
                    );
                } else {
                    res.send('Unauthorized');
                }
            }
        }
    )
});

app.post('/admin/adminDeleteUser', (req, res) => {
    const searchUsername = req.body.searchUsername;
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        `call findAdmin('${username}', '${password}')`,
        (err, results) => {
            if (err) {
                res.send(err);
            } else {
                if (results.length > 0) {
                    connection.query(
                        `call deleteUser('${searchUsername}')`,
                        (err, results) => {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(results);
                            }
                        }
                    );
                } else {
                    res.send('Unauthorized');
                }
            }
        }
    )
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`is running on http://localhost:${PORT}`);
});