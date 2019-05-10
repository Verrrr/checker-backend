const express = require('express');
const mysql = require("mysql")
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { c, cpp, node, python, java } = require('compile-run');
const app = express();

// fs.readFile("./Try.java", 'utf8', (err, data) => {
//    if (err) throw err;

//    java.runSource(data, { stdin: '12\n10\n10' })
//       .then((response) => {
//          console.log(response)
//       })
//       .catch((err) => console.log(err));
// })
// ./Try.java

app.use(express.json());
app.use(cors());

const secretKey = "johnlovejananwew";


//Connection
var pool = mysql.createPool({
   connectionLimit: 10,
   host: 'localhost',
   user: 'root',
   database: 'checker'
});

//Auth


//User
const user = require('./routes/user');
app.use(user);

//Admin auth
const adminAuth = require('./routes/admin-auth');
app.use('/admin', adminAuth);

//Exams
const exams = require('./routes/exams');
app.use(exams);

//Students
const student = require('./routes/student');
app.use(student);

//Questions
const questions = require('./routes/questions');
app.use(questions);

//test cases
const test_cases = require('./routes/test-case');
app.use(test_cases);

//Students  Questions With Cases
const std_qts_cases = require('./routes/std-qts-cases');
app.use(std_qts_cases);

//Student Exam
const studentExam = require('./routes/student-exam');
app.use(studentExam)




var server = app.listen(8080, () => {
   console.clear();
   console.log("Server started at port 8080")
});