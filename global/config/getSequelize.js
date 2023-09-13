const { Sequelize } = require('sequelize')
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.js');
const sequelize = new Sequelize(config.database, config.user, config.password, config)
module.exports = () => {
    return sequelize
}