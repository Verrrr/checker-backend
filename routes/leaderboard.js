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

router.get('/leaderboard/:exam_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "SELECT * FROM students WHERE exam_id = ?";
   pool.query(sql, [req.params.exam_id], (err, results) => {
      if (err) res.json(err);
      results.forEach((element, index) => {
         let sql2 = "SELECT *,SUM(test_cases.points) AS total FROM student_cases INNER JOIN test_cases ON student_cases.test_id = test_cases.test_id WHERE student_cases.std_id = ? AND student_cases.isCorrect = true;";
         pool.query(sql2, [element.std_id], (err, results2) => {
            if (err) res.json(err);
            results[index]["total"] = results2[0].total;
         });
      });

      setTimeout(() => {
         res.json(results);
      }, 100);
   });
});


module.exports = router;