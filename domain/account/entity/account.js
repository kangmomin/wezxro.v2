import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

class Account extends Model {}

Account.init('account ',{
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
  passowrd: {
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
})

export default Account