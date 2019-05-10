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
   let counter = 0;
   let updates = "";
   fs.readFile(req.body.code_path, 'utf8', (err, data) => {
      if (err) throw err;
      let sql = "SELECT * FROM student_cases INNER JOIN test_cases ON student_cases.test_id = test_cases.test_id WHERE test_cases.qts_id = ? AND student_cases.std_id = ?";
      pool.getConnection((err, connection) => {
         if (err) throw err;

         let query = connection.query(sql, [req.body.qts_id, req.params.std_id], async (err, results) => {
            for (let index = 0; index < results.length; index++) {

               try {
                  let input = results[index].inputs.replace(/\\n/g, '\n');
                  let checkerFile = await java.runSource(data, { stdin: `${input}` });
                  let userFile = await java.runSource(req.body.code, { stdin: `${input}` })

                  if (checkerFile.stdout != "" && userFile.stdout != "" && checkerFile.stdout.trim() === userFile.stdout.trim()) {
                     console.log("tama")
                     counter++;
                     updates += `UPDATE student_cases SET err_msg = "", isCorrect = true WHERE std_id = ${req.params.std_id} AND test_id = ${results[index].test_id};`;

                  } else {
                     updates += `UPDATE student_cases SET err_msg = ${pool.escape(userFile.stderr)},isCorrect = false WHERE std_id = ${req.params.std_id} AND test_id = ${results[index].test_id};`;
                     console.log('mali')


                  }

                  if (index == results.length - 1) {

                     if (counter == results.length) {
                        updates += `UPDATE student_question SET isCompleted = true,
                         code = ${pool.escape(req.body.code)} WHERE std_id = ${req.params.std_id}
                          AND qts_id = ${req.body.qts_id};`;
                     } else {
                        updates += `UPDATE student_question SET isCompleted = false,
                         code = ${pool.escape(req.body.code)}
                          WHERE std_id = ${req.params.std_id} AND qts_id = ${req.body.qts_id};`;
                     }
                     callback(updates);

                  }

               } catch (error) {
                  console.log(error)
               }


            }

            // results.forEach(async (results[index], index) => {


            // });





         });

         function callback(updates) {
            console.log(req.params.std_id)
            console.log("tapos na")
            let query = connection.query(updates, (err, results) => {
               if (err) {
                  connection.release();
                  res.json(err);
               }

               connection.release();
               res.json(results).end();

            })

         }

      });


   });


});




module.exports = router;