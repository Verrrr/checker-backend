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

router.post('/test-case', [verifyToken, isAdmin], (req, res) => {
   let sql = "INSERT INTO test_cases SET ?";
   pool.query(sql, [req.body], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.get('/test-case/:qts_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "SELECT * FROM test_cases WHERE qts_id = ?";
   pool.query(sql, [req.params.qts_id], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.delete('/test-case/:test_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "DELETE FROM test_cases WHERE test_id = ?";
   pool.query(sql, [req.params.test_id], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});

router.patch('/test-case/:test_id', [verifyToken, isAdmin], (req, res) => {
   let sql = "UPDATE test_cases SET ? WHERE test_id = ?";
   pool.query(sql, [req.body, req.params.test_id], (err, results) => {
      if (err) res.json(err);
      res.json(results);
   });
});





module.exports = router;