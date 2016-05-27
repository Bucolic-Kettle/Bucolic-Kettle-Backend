var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var KEYS = require('./config/config.js');

var signIn = require('./routes/signIn');

var app = express();


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

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
  console.log('serialize');
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log('deserialize');
  done(null, obj);
});




passport.use(new GoogleStrategy({
  clientID: KEYS.GOOGLE_CONSUMER_KEY,
  clientSecret: KEYS.GOOGLE_CONSUMER_SECRET,
  callbackURL: 'http://localhost:8000/auth/google/callback',
  passReqToCallback: true
},
  function(request, accessToken, refreshToken, profile, done) {

    console.log(profile);
    console.log('INSIDE');

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
      passport.authenticate( 'google', { 
        successRedirect: '/',
        failureRedirect: '/login'
      }));

app.get('/login', function(req, res) {
  res.send('login');
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
