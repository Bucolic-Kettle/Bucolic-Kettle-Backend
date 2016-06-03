var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var helpers = require('./lib/utils');
// var KEYS = require('./config/config.js');

var cookieParser = require('cookie-parser');


var LocalStrategy = require('passport-local').Strategy;

var signIn = require('./routes/signIn');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'sdlfjljrowuroweu',
  cookie: { httpOnly: false }
}));

// app.use(session({ 
//   secret: KEYS.SESSION, 
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } }));

// http://stackoverflow.com/questions/9071969/using-express-and-node-how-to-maintain-a-session-across-subdomains-hostheaders
app.use(function(req, res, next) {
  console.log('body: ', req.body);

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
//CORS middleware
//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-node-js
// var allowCrossDomain = function(req, res, next) {
//   console.log("INC REQ :", req.session)
//   res.header('access-control-allow-origin', '*');
//   res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('access-control-allow-headers', 'Origin, X-Requested-With, content-type, accept');
//   res.header('access-control-max-age', 10); 
//   next();
// };

app.post('/login', function(req, res) {

  // var urlParts = url.parse(req.url, true);          
  // var username = urlParts.query.username;
  // var password = urlParts.query.password;

  var body = JSON.parse(Object.keys(req.body)[0]); // temp hack to get body

  var username = body.username;
  var password = body. password;

  helpers.checkUser(username, password, function(user) {
      console.log("session :", req.session)
      
    if (user) {
      req.session.user = user.id; 
      console.log("AFTER: ", req.session)
      res.status(200).send({auth: true, username: user.username});
    } else {
      res.status(403).send(user);
    }

  }); 

});

app.post('/signup', function(req, res) {

  // var urlParts = url.parse(req.url, true);          
  // var username = urlParts.query.username;
  // var password = urlParts.query.password;


  var body = JSON.parse(Object.keys(req.body)[0]); // temp hack to get body

  var username = body.username;
  var password = body. password;


  helpers.addUser(username, password, function(user) {
      console.log("sign up :", req.session)
      
    if (user) {
      req.session.user = user.id; 
      res.status(200).send({auth: true, username: user.username});
    } else {
      console.log('sending bad:', user)
      res.status(400).send(user);
    }

  }); 


});

app.get('/guest', function(req, res) {

  res.status(200).send({auth: true, username: 'guest'});

});

app.get('/checkSession', function(req, res) {

  res.status(200).send({auth: true, username: 'guest'});

});


/// test
app.get('/test', 
function(req, res) {
  // req.session.user = '69'; 
  console.log('CURRENT SESSION: ', req.session);
  res.status(200).send('done');
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