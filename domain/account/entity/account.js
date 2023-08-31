const { DataTypes, Model } = require('sequelize');
const status = require('../../../global/entity/status');
const sequelize = require('../../../global/config/getSequelize')()

class Account extends Model {}

Account.init({
  userId: {
    field: "user_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
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
    type: DataTypes.STRING(20),
    allowNull: false
  },
  money: {
    type: DataTypes.DOUBLE,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM,
    values: Object.values(status),
    defaultValue: status.active
  }
}, {
  timestamps: true,
  sequelize,
  modelName: 'account',
  tableName: 'account'
})

module.exports = Account