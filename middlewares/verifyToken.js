const jwt = require('jsonwebtoken');
const config = require('../configs/config');

module.exports = function verifyToken(req, res, next) {
   res.setHeader('Content-type', 'Application/json');
   const bearerHeader = req.headers['authorization'];
   if (!!bearerHeader) {
      if (bearerHeader.split(' ').length <= 1) {
         //Checks if format Bearer 'token' is correct
         res.status(422).json({ message: 'Invalid bearer fromat' });
      } else {
         const bearerToken = bearerHeader.split(' ')[1];
         jwt.verify(bearerToken, config.secretKey, (err, result) => {
            if (err) {
               res.status(403).json({ message: err.message });
            } else {
               req.token = result;
               next();
            }
         });
      }
   } else {
      res.status(403).json({ message: "Token missing from header" });
   }
}