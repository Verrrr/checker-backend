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


router.get("/exams", [verifyToken, isAdmin], (req, res) => {
   let sql = "SELECT * FROM exams";
   pool.query(sql, (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});


router.post('/exams', [verifyToken, isAdmin], (req, res) => {
   let sql = "INSERT INTO exams SET ?";
   pool.query(sql, req.body, (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});


router.patch('/exams/:exam_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "UPDATE exams SET ? WHERE exam_id = ?";
   pool.query(sql, [req.body, req.params.exam_id], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});


router.delete('/exams/:exam_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "DELETE FROM exams WHERE exam_id = ?";
   pool.query(sql, [req.params.exam_id], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});











module.exports = router;