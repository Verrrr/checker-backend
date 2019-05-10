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

router.get('/students/:exam_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "SELECT * FROM students WHERE exam_id = ?";
   pool.query(sql, [req.params.exam_id], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.get('/student/:std_id', (req, res) => {
   let sql = "SELECT * FROM students WHERE std_id = ?";
   pool.query(sql, [req.params.std_id], (err, results) => {
      if (err) res.json(err);
      res.json(results[0]);
   });
});

router.post('/student', [verifyToken, isAdmin], (req, res) => {
   let sql = "INSERT INTO students SET ?";
   pool.query(sql, [req.body], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});


router.delete('/student/:std_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "DELETE FROM students WHERE std_id = ?";
   pool.query(sql, [req.params.std_id], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});

router.patch('/student/:std_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "UPDATE students SET ? WHERE std_id = ?";
   pool.query(sql, [req.body, req.params.std_id], (err, results) => {
      if (err) return res.json(err);
      res.json(results);
   });
});


router.get('/student-questions/:std_id', (req, res) => {
   let sql = "SELECT * FROM student_question LEFT JOIN questions ON student_question.qts_id = questions.qts_id WHERE student_question.std_id = ?";
   pool.query(sql, [req.params.std_id], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.get('/student-test-cases/:std_id/:qts_id', (req, res) => {
   let sql = "SELECT err_msg,inputs,isCorrect,isHidden,points FROM student_cases INNER JOIN test_cases ON student_cases.test_id = test_cases.test_id WHERE student_cases.std_id = ? AND test_cases.qts_id = ?";
   pool.query(sql, [req.params.std_id, req.params.qts_id], (err, results) => {
      if (err) res.json(err);

      results.forEach((element, index) => {
         if (element.isHidden) {
            results[index]["inputs"] = "hidden";
            results[index]["err_msg"] = "hidden";
         }
      });
      res.json(results);
   });
});














module.exports = router;