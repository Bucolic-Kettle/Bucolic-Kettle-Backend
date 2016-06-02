var Sequelize = require('sequelize');
// var sequelize = new Sequelize('database', 'postgres', 'pword', {
//   host: 'localhost', 
//   port: 5432, 
//   dialect: 'postgres' 
// });

// http://blog.jasonmeridth.com/posts/postgresql-command-line-cheat-sheet/
var sequelize = new Sequelize('postgres://localhost:5432/test2');


module.exports = sequelize;

// User.sync().then(function () {
//   // Table created
//   return User.create({
//     firstName: 'Drew',
//     lastName: 'Tepper'
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