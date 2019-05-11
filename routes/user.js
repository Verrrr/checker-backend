const express = require("express");
const router = express.Router();
const pool = require('../configs/pool');
const cors = require('cors');
const config = require('../configs/config');
const bcrypt = require('bcrypt');
//middlewares
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');


router.use(express.json());
router.use(cors());
router.get('/try', (req, res) => {
   res.json({ "message": "try" });
});

router.post('/users', [verifyToken, isAdmin], (req, res) => {
   let sql = "INSERT INTO users SET ?";
   req.body.password = bcrypt.hashSync(req.body.password, 10);
   pool.query(sql, req.body, (err, result) => {
      if (err) return res.json(err);
      res.json({ id: result.insertId });
   });
});

router.get('/users', [verifyToken, isAdmin], (req, res) => {
   let sql = "SELECT * FROM users";
   pool.query(sql, ['user'], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});

router.delete('/users/:id', [verifyToken, isAdmin], (req, res) => {
   let sql = "DELETE FROM users WHERE id = ?";
   pool.query(sql, [req.params.id], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});

router.patch('/users/:id', [verifyToken, isAdmin], (req, res) => {
   if (!!req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
   }
   let sql = "UPDATE users SET ? WHERE id = ?";
   pool.query(sql, [req.body, req.params.id], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});




module.exports = router;