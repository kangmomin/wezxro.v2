const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../global/config/getSequelize')()

class Account extends Model {}

Account.init({
  userId: {
    field: "user_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrementIdentity: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  random: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  money: {
    type: DataTypes.DOUBLE,
    defaultValue: 0
  },
}, {
  timestamps: true,
  sequelize,
  modelName: 'account',
  tableName: 'account'
})

module.exports = Account