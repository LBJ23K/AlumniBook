var i18n = require('i18n');
var fs = require('fs');

exports.locales = function(req, res) {
  // TODO: automatically get all locale files
  fs.readdir(__dirname + '/../config/locales', function(err, files) {
    var locales = files.map(function(file) {
      return file.replace(".json", "");
    });

    res.json(locales);
  });
};

exports.setLocale = function(req, res) {
  var newLocale = req.body.locale;
  console.log(newLocale)
  req.setLocale(newLocale);
  console.log(req.getLocale());
  res.json({msg:req.getLocale()})
  // res.redirect('/');
};