var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

// passport.use(new GoogleStrategy({
//   consumerKey: '275510713543-s4fe85r8t4gc7iqldppjkte6vmlrfirn.apps.googleusercontent.com', //GOOGLE_CONSUMER_KEY,
//   consumerSecret: '_zDDisPH76SFBRqMS48c-mQV',//GOOGLE_CONSUMER_SECRET,
//   callbackURL: 'http://localhost:8000/oauth2callback'
// },
//   function(token, tokenSecret, profile, done) {
      
//     console.log('inhere')

//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//   }
// ));

// router.get('/', function(req, res, next) {
  

//   res.send('Recieved');



// });

module.exports = router;
