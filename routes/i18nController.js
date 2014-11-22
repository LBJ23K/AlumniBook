var i18n = require('i18n');

exports.locales = function(req, res) {
  // TODO: automatically get all locale files
  var locales = ["en", "zh-TW"];
  res.json(locales);
};

exports.setLocale = function(req, res) {
  var newLocale = req.body.locale;
  req.setLocale(newLocale);
  res.redirect('/');
};