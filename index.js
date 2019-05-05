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
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    database        : 'checker'
});

//Auth
app.post('/login', (req, res) => {
    let sql = "SELECT * FROM users WHERE username = ? ";
    pool.query(sql, [req.body.username], (err, results) => {
        if(err) return res.json(err);
        if(results.length != 0){
            if(bcrypt.compareSync(req.body.password, results[0].password)){
                let user = {
                    id : results[0].id,
                    firstname: results[0].firstname,
                    lastname: results[0].lastname,
                    isAdmin: results[0].role=='admin'?true:false,
                    username: results[0].username
                };
                const token = jwt.sign(user,secretKey);
                res.json({token});
            } else {
                res.status(400).json({message: "invalid credentials"});
            }
        } else {
            res.status(400).json({message: "invalid credentials"});
        }
    });
});

//User
app.post('/users', [verifyToken, isAdmin], (req, res) => {
    let sql = "INSERT INTO users SET ?";
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    pool.query(sql, req.body, (err, result) => {
        if(err) return res.json(err);
        res.json({id: result.insertId});
    });
});


//functions
function verifyToken(req, res, next){
    res.setHeader('Content-type','Application/json');
    const bearerHeader = req.headers['authorization'];
    if(!!bearerHeader){
        if(bearerHeader.split(' ').length <= 1){
            //Checks if format Bearer 'token' is correct
            res.status(422).json({message: 'Invalid bearer fromat'});
        } else {
            const bearerToken = bearerHeader.split(' ')[1];
            jwt.verify(bearerToken,secretKey , (err,result) =>{
                if(err){
                    res.status(403).json({message: err.message});
                } else {
                    req.token = result;
                    next();
                }
            });
        }
    } else {
        res.status(403).json({message: "Token missing from header"});
    }
}

function isAdmin(req, res, next) {
    if(!!req.token.isAdmin){
       next(); 
    } else
        res.status(401).json({message: 'Unauthorized'});
}


var server = app.listen(8080, () => {
    console.clear();
    console.log("Server started at port 8080")
});