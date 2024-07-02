const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./config');

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'events'
});

sequelize.sync();

module.exports = Event;
