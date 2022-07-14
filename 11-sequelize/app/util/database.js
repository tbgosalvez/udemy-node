const Sequelize = require('sequelize');

// db connection pool managed by Sequelize
const sequelize = new Sequelize('udemy_node', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  insecureAuth: true,
  port: 3306
});

module.exports = sequelize;
