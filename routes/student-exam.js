const express = require("express");
const router = express.Router();
const pool = require('../configs/pool');
const cors = require('cors');
const config = require('../configs/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { c, cpp, node, python, java } = require('compile-run');
//middlewares
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken');

router.use(express.json());
router.use(cors());


router.get('/student-exam/questions/:exam_id/:std_id', (req, res) => {
   let sql = "SELECT * FROM questions INNER JOIN student_question ON questions.qts_id = student_question.qts_id WHERE questions.exam_id = ?";
   pool.query(sql, [req])
});

router.patch('/student-exam/submit/:std_id', (req, res) => {

   fs.readFile(req.body.code_path, 'utf8', (err, data) => {
      if (err) throw err;
      let sql = "SELECT * FROM student_cases INNER JOIN test_cases ON student_cases.test_id = test_cases.test_id WHERE test_cases.qts_id = ? AND student_cases.std_id = ?";
      pool.getConnection((err, connection) => {
         if (err) throw err;

         let query = connection.query(sql, [req.body.qts_id, req.params.std_id], (err, results) => {
            let counter = 0;
            let updates = "";
            results.forEach(async (element, index) => {
               try {
                  let input = results[index].inputs.replace(/\\n/g, '\n');
                  let checkerFile = await java.runSource(data, { stdin: `${input}` });
                  let userFile = await java.runSource(req.body.code, { stdin: `${input}` });
                  if (checkerFile.stdout == userFile.stdout) {
                     counter++;
                     updates += (`UPDATE student_cases SET isCorrect = true WHERE std_id = ${req.params.std_id} AND test_id = ${element.test_id};`);
                  } else {
                     updates += (`UPDATE student_cases SET isCorrect = false WHERE std_id = ${req.params.std_id} AND test_id = ${element.test_id};`);
                     console.log('mali')
                  }
                  console.log(counter)

               } catch (error) {
                  console.log(error)
               }
               if (index == results.length - 1) {
                  if (counter == results.length - 1) {
                     updates += (`UPDATE student_question SET isCompleted = true, code = '${req.body.code}' WHERE std_id = ${req.params.std_id} AND qts_id = ${req.body.qts_id};`);
                  } else {
                     updates += (`UPDATE student_question SET isCompleted = false, code = '${req.body.code}' WHERE std_id = ${req.params.std_id} AND qts_id = ${req.body.qts_id};`);

                  }
                  callback(updates);
               }
            });





         });
         function callback(updates) {
            console.log(updates)
            connection.query(updates, (err, results) => {
               if (err) {
                  connection.release();
                  res.json(err);
               }

               connection.release();
               res.json(results);
            })
         }
      });


   });


});


module.exports = router;