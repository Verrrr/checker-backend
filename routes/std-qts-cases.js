const express = require("express");
const router = express.Router();
const pool = require('../configs/pool');
const cors = require('cors');
const config = require('../configs/config');
const bcrypt = require('bcrypt');
const formidable = require('express-formidable');
//middlewares
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');

router.use(express.json());

router.use(cors());


router.post('/std-qts-cases', [verifyToken, isAdmin], (req, res) => {
   pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.beginTransaction((err) => {
         if (err) { throw err; }
         if (req.body.student_cases.length > 0) {

            connection.query("INSERT INTO student_cases (test_id,std_id) VALUES ? ", [req.body.student_cases], (err, results) => {
               if (err) {
                  return connection.rollback(function () {
                     connection.release();
                     throw err;

                  });
               }
            });
         }

         if (req.body.student_questions.length > 0) {

            let query = connection.query("INSERT INTO student_question (std_id,qts_id) VALUES ?", [req.body.student_questions], (err, results) => {
               if (err) {
                  return connection.rollback(function () {
                     connection.release();
                     throw err;

                  });
               }
            });
            console.log(query.sql)
         }


         connection.commit((err) => {
            if (err) {
               return connection.rollback(function () {
                  connection.release();
                  throw err;
               });
            }
            connection.release();

            res.json({
               message: "Inserted"
            });
         });
      });
   });
});


router.post('/std-qts', [verifyToken, isAdmin], (req, res) => {
   pool.query("INSERT INTO student_question (std_id, qts_id) VALUES ?", [req.body.student_questions], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.post('/std-cases', [verifyToken, isAdmin], (req, res) => {
   pool.query("INSERT INTO student_cases (test_id, std_id) VALUES ?", [req.body.student_cases], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.get('/std-qts-cases/:std_id', (req, res) => {
   let sql = "SELECT * FROM student_question LEFT JOIN questions ON student_question.qts_id = questions.qts_id WHERE student_question.std_id = ?";
   pool.query(sql, [req.params.std_id], (err, results) => {
      if (err) res.json(err);
      if (results.length > 0) {
         results.forEach((element, index) => {
            let sql = "SELECT * FROM student_cases LEFT JOIN test_cases ON student_cases.test_id = test_cases.test_id WHERE test_cases.qts_id = ?";
            pool.query(sql, [element.qts_id], (err, results2) => {
               if (err) res.json(err);
               results[index]["test_cases"] = results2;
            });
         });
      }

      setTimeout(() => {
         res.json(results);
      }, 100);
   });
});




module.exports = router;