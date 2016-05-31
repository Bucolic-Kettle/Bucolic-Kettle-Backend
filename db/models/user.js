var Sequelize = require('sequelize');
var sequelize = require('../config');


var User = sequelize.define('user', {

  username: Sequelize.STRING,
  password: Sequelize.STRING

});

module.exports = User;


// User.sync().then(function () {
//   // Table created
//   return User.create({
//     username: 'Mike',
//     password: 'Sherwood'
//   });
// });

// User.findAll({
//   where: {
//     lastName: 'Tepper'
//   }
// }).then(function(val) {
//   // console.log(val[0].dataValues)
//   console.log(val);

// });