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
const uploadFile = require('../middlewares/uploadFile');


router.use(express.json());

router.use(cors());

router.post('/question', [verifyToken, isAdmin, uploadFile], (req, res) => {
   let sql = "INSERT INTO questions SET ?";
   pool.query(sql, [req.body], (err, results) => {
      if (err) res.json(err);
      res.json(results)
   });

});

router.patch('/question/code/:std_id/:qts_id', (req, res) => {
   let sql = "UPDATE student_question SET code = ? WHERE std_id = ? AND qts_id = ?";
   pool.query(sql, [req.body.code, req.params.std_id, req.params.qts_id], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});


router.get('/questions/:exam_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "SELECT * FROM questions WHERE exam_id = ?";
   pool.getConnection((err, connection) => {
      connection.beginTransaction((err) => {
         if (err) throw err;
         connection.query(sql, [req.params.exam_id], (err, results) => {
            if (err) {
               return connection.rollback(function () {
                  connection.release();
                  throw err;
               });
            }

            results.forEach((element, index) => {
               connection.query("SELECT * FROM test_cases WHERE qts_id = ?", [element.qts_id], (err, results2) => {
                  if (err) {
                     return connection.rollback(function () {
                        connection.release();
                        throw err;
                     });
                  }
                  results[index]["test_cases"] = results2;
               });
            });

            connection.commit((err) => {
               if (err) {
                  return connection.rollback(function () {
                     throw err;
                  });
               }
               connection.release();
               setTimeout(() => {
                  res.json(results);
               }, 100);
            })
         });

      });
   });


});
















module.exports = router;