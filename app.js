
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var session = require('express-session');
var local = require('./config/local');

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
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
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

// app.get('/auth/facebook', api.facebookAuth);



app.get('/api/posts', api.showPosts);
app.get('/api/post/:id', api.showPost);

app.post('/api/login', api.login);
// app.post('/api/createMember', api.createMember);
app.post('/api/submitPost', api.submitPost);
app.post('/api/comment', api.commentOn);
app.post('/api/signup', api.createMember);

app.get('/api/like/:id', api.likePost);
app.get('/api/dislike/:id', api.dislikePost);

app.get('/logout', function(req, res){
  req.session.destroy(function() {
    res.redirect("/");
  });
});
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);
// for clear logout


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
