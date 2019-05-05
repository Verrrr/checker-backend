const express = require('express');
const mysql = require("mysql")
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors());

const secretKey = "johnlovejananwew";


//Connection
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'checker'
});

//Auth
app.post('/login', (req, res) => {
    let sql = "SELECT * FROM users WHERE username = ? ";
    pool.query(sql, [req.body.username], (err, results) => {
        if (err) return res.json(err);
        if (results.length != 0) {
            if (bcrypt.compareSync(req.body.password, results[0].password)) {
                let user = {
                    id: results[0].id,
                    firstname: results[0].firstname,
                    lastname: results[0].lastname,
                    isAdmin: results[0].role == 'admin' ? true : false,
                    username: results[0].username
                };
                const token = jwt.sign(user, secretKey);
                res.json({ token });
            } else {
                res.status(400).json({ message: "invalid credentials" });
            }
        } else {
            res.status(400).json({ message: "invalid credentials" });
        }
    });
});

//User
const user = require('./routes/user');
app.use(user);




var server = app.listen(8080, () => {
    console.clear();
    console.log("Server started at port 8080")
});