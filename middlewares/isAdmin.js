module.exports = function isAdmin(req, res, next) {
   if (!!req.token.isAdmin) {
      next();
   } else
      res.status(401).json({ message: 'Unauthorized' });
}