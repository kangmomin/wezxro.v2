const { Model, DataTypes } = require("sequelize");
const status = require("./constant/status");
const getSequelize = require("../../../global/config/getSequelize");

class Depoist extends Model {}

Depoist.init({
    depoistId: {
        field: "depoist_id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rname: {
        type: DataTypes.STRING(30),
        unique: false,
        allowNull: false
    },
    pay: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(Object.values(status)),
        defaultValue: status.pending
    },
    type: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT
    },
    agree: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    bussinessName: {
        type: DataTypes.STRING(30)
    },
    bussinessRegno: {
        type: DataTypes.STRING(13)
    },
    bussinessOwner: {
        type: DataTypes.STRING(15)
    },
    bussinessPhone: {
        type: DataTypes.STRING(30)
    },
    bussinessEmail: {
        type: DataTypes.STRING(255)
    },
    personalPhone: {
        type: DataTypes.STRING(30)
    },
}, {
    timestamps: true,
    sequelize: getSequelize(),
    modelName: "depoist",
    tableName: "depoist"
})

module.exports = Depoist