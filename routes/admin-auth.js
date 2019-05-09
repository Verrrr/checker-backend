const express = require("express");
const router = express.Router();
const pool = require('../configs/pool');
const cors = require('cors');
const config = require('../configs/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//middlewares
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');

router.use(express.json());
router.use(cors());


router.post('/login', (req, res) => {
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
                const token = jwt.sign(user, config.secretKey);
                res.json({ token });
            } else {
                res.status(400).json({ message: "invalid credentials" });
            }
        } else {
            res.status(400).json({ message: "invalid credentials" });
        }
    });
});











module.exports = router;