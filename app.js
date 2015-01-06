
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  user_api = require('./routes/user_api'),
  path = require('path'),
  issue = require('./routes/issue'),
  comment = require('./routes/comment'),
  notify = require('./routes/notify'),
  postCategory = require('./routes/postCategory');
  var _ = require('underscore');

var session = require('express-session');
var local = require('./config/local');
var i18n = require('i18n');
var i18nController = require('./routes/i18nController');
var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy

passport.serializeUser(function(user, done) {
  // console.log(user);
  done(null, user);
  });

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'http://sdm.im.ntu.edu.tw/simplesamlauth/saml2/idp/SSOService.php',
    issuer: 'passport-saml-sso-2'
  },
  function(profile, done){
    return done(null, profile);
  })
);

i18n.configure({
  locales:['en', 'zh-TW'],
  defaultLocale: 'zh-TW',
  directory: __dirname + '/config/locales'
});

var app = module.exports = express();

// Session

var RedisStore = require('connect-redis')(session);
var sessionRedis = new RedisStore(local.session.redis);

app.use(session({
    store: sessionRedis,
    secret: "yoyopowerzinja",
    cookie: {
      expires: new Date(Date.now() + 30*24*60*60*1000),
      maxAge: 30*24*60*60*1000
    }
  }));
// all environments
function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  var origin = req.headers.origin;
  if (_.contains(app.get('allowed_origins'), origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);



// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */



// serve index
app.get('/', routes.index);
app.get('/partial/:name', routes.partial);
app.get('/translate/:text',api.translate);
app.get('/local_login/:account',api.local_Login);

app.get('/api/user/me', api.checkLogin,user_api.getUser);//mysetting
app.post('/api/user/modify', api.checkLogin,user_api.modifyUser);
app.post('/api/user/removeExp',user_api.removeExp);
app.get('/api/users/:id',user_api.getUserData);//particular user
app.get('/api/users',user_api.getAlluser);//alluserList

app.get('/user/search/account', api.checkLogin, user_api.searchUserAccount);
app.get('/user/search/name', api.checkLogin, user_api.searchUserName);
app.get('/user/search/school', api.checkLogin, user_api.searchUserSchool);
app.get('/user/search/gender', api.checkLogin, user_api.searchUserGender);
app.get('/user/search/department', api.checkLogin, user_api.searchUserDepartment);
app.get('/user/search/grade', api.checkLogin, user_api.searchUserGrade);

app.post('/search', api.checkLogin, api.search);

app.get('/api/locales', i18nController.locales);
app.post('/api/setLocale', i18nController.setLocale);

app.get('/api/posts', api.showPosts);
app.get('/api/post/:id', api.showPost);

app.post('/api/login', api.login);
app.get('/api/getaccount', api.getaccount);
// app.post('/api/createMember', api.createMember);
app.post('/api/submitPost', api.checkLogin, api.submitPost);
app.post('/api/comment', api.checkLogin, api.commentOn);
app.post('/api/modifyaccount', api.modifyaccount);

app.post('/issue/create', api.checkLogin, issue.create);
app.get('/issue/list', issue.list);
app.get('/issue/listById', issue.listById);
app.post('/issue/update', api.checkLogin, issue.update);
app.get('/issue/destroy', api.checkLogin, issue.destroy);
app.get('/issue/searchFields', issue.supportedSearchFields);
app.post('/issue/search', api.checkLogin, issue.search);

app.post('/comment/update', api.checkLogin, comment.update);
app.get('/comment/destroy', api.checkLogin, comment.destroy);

app.get('/api/like/:id', api.checkLogin, api.likePost);
app.get('/api/dislike/:id', api.checkLogin, api.dislikePost);

app.get('/notify/subscribe/:id', api.checkLogin, notify.subscribe);
app.get('/notify/unsubscribe/:id', api.checkLogin, notify.unsubscribe);
app.get('/notify/get_notifications', api.checkLogin, notify.get_notifications)
app.get('/api/notify/:id/:type', api.checkLogin, notify.notify);

app.post('/category/create', postCategory.create);
app.get('/category/list', postCategory.list);
app.post('/category/update', postCategory.update);
app.get('/category/destroy', postCategory.destroy);

app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function() {
    res.redirect("/");
  });
});
// //saml
app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  user_api.login
  // function(req, res) {
  //   console.log(req.user);
  //   res.redirect('/');
  // }
);
app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/login');
  }
);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);
// for clear logout

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
