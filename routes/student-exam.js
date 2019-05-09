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


router.get('/student-exam/questions/:exam_id/:std_id', (req, res) => {
   let sql = "SELECT * FROM questions INNER JOIN student_question ON questions.qts_id = student_question.qts_id WHERE questions.exam_id = ?";
   pool.query(sql, [req])
});



module.exports = router;