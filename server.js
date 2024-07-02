const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();


const app = express();

app.use(express.static('public'));
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
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


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`is running on http://localhost:${PORT}`);
});