const formidable = require('formidable');
const path = require('path');
module.exports = function uploadPhoto(req, res, next) {
   var form = new formidable.IncomingForm();
   var profilePath;
   form.on('error', (err) => {
      throw err;
   });
   form.parse(req, (err, fields, files) => {

      if (err) throw err;
      req.body = fields;
   });

   form.on('fileBegin', function (name, file) {

      let newImageName = req.token.id + '.' + ".txt";
      profilePath = path.join(__dirname, '..', 'codes/') + Date.now() + '' + newImageName;
      file.path = profilePath;
      profilePath = 'codes/' + Date.now() + '' + newImageName;

   });

   form.on('file', function (name, file) {
      req.body.code_path = profilePath;
   });

   form.on('end', () => {
      req.body.code_path = profilePath;
      next();
   });
}