var User = require('../db/models/user');
var bcrypt = require('bcrypt-nodejs');


var helpers = {};

helpers.addUser = function(username, password, cb) {

  User.findAll({ where: {username: username} })
  .then(function(users) {

    if (users.length > 0) {
      console.log('Username must be unique');
      cb(null);
    } else {

      User.sync().then(function () {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        return User.create({
          username: username,
          password: hash
        })
        .then(function(user) {
          console.log(user)
          cb(user.username);
        });
      });

      console.log(username, ' has been added');

    }

  });
};


helpers.checkUser = function(username, password, cb) {

  User.findAll({ where: {username: username} })
  .then(function(user) {

    if (user.length === 0) {
      console.log('No username found');
      cb(null);
    } else {

      if (bcrypt.compareSync(password, user[0].dataValues.password)) {
        console.log('YOU ARE LOGGED IN');
        cb(user[0]);
      } else {
        console.log('YOU ARE NOT AUTH');
        cb(null);
      }
    }

  });
};

module.exports = helpers;

// helpers.addUser('Jorn', 'Bell');

// helpers.checkUser('Jorn', 'Bell');

// User.findAll({
//   where: {
//     lastName: 'Tepper'
//   }
// }).then(function(val) {
//   // console.log(val[0].dataValues)
//   console.log(val);

// });


// User.sync().then(function () {
//   // Table created
//   return User.create({
//     username: 'Mike',
//     password: 'Sherwood'
//   });
// });


// Message.sync()
// .then(function() {
//   // Now instantiate an object and save it:
//   User.findAll({ where: {username: 'Tony'} })
//   .then(function(users) {
//     users.forEach(function(user) {
//       console.log('IDIDIDIDID',user.id)
//       return Message.create({UserId: user.id, message: 'I am the warchief', roomname: 'orgrimar'});
//     });

//     // db.close();
//   });
