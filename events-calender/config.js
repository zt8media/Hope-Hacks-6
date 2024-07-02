const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('events', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
