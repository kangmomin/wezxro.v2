const { Model, DataTypes } = require("sequelize");
const sequelize = require('../../../global/config/getSequelize')()

class Session extends Model {}

Session.init({
    sid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    sess: {
        type: DataTypes.JSON,
        allowNull: false
    },
    expire: {
        type: 'TIMESTAMP',
        allowNull: false
    }
}, {
    modelName: "session",
    tableName: "session",
    timestamps: false,
    sequelize,
})

module.exports = Session