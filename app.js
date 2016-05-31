var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var helpers = require('./lib/utils')
var KEYS = require('./config/config.js');

var LocalStrategy = require('passport-local').Strategy;

var signIn = require('./routes/signIn');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(session({ secret: KEYS.SESSION }));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/auth/google', signIn);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  console.log('serialize', user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log('deserialize', obj);
  done(null, obj);
});

// CORS
// http://enable-cors.org/server_expressjs.html
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
//CORS middleware
//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-node-js
var allowCrossDomain = function(req, res, next) {
  // console.log("domain:", req.method)
  res.header('access-control-allow-origin', '*');
  res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('access-control-allow-headers', 'Origin, X-Requested-With, content-type, accept');
  res.header('access-control-max-age', 10); 
  next();
};

app.use(allowCrossDomain);

passport.use(new LocalStrategy(
  function(username, password, done) {

    console.log(username, password)
    // User.findOne({ username: username }, function(err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
      return done(null, user);
    // });
  }
));

passport.use(new GoogleStrategy({
  clientID: KEYS.GOOGLE_CONSUMER_KEY,
  clientSecret: KEYS.GOOGLE_CONSUMER_SECRET,
  callbackURL: 'http://localhost:8000/auth/google/callback',
  passReqToCallback: true
},
  function(request, accessToken, refreshToken, profile, done) {

    // console.log(profile);
    console.log('INSIDE');

    // request.send('donezo')
    done(null, 'teser')
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/google/callback', 
      passport.authenticate( 'google', function(err, user) {
        console.log(user)
      }));

      // passport.authenticate( 'google', { 
      //   successRedirect: '/',
      //   failureRedirect: '/login'
      // }));

app.post('/login', function(req, res) {

  var urlParts = url.parse(req.url, true);          
  var username = urlParts.query.username;
  var password = urlParts.query.password;

  helpers.checkUser(username, password);

  res.send('hi');

});

app.post('/signup', function(req, res) {

  var urlParts = url.parse(req.url, true);          
  var username = urlParts.query.username;
  var password = urlParts.query.password;

  helpers.addUser(username, password);

  res.send('hi');

});


app.get('/login', function(req, res) {
  console.log('get login: ', req.body);

  res.send('hi');


});

app.get('/', function(req, res) {
  res.send('home');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

var port = process.env.PORT || '8000';

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});