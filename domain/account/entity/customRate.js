const { Model, DataTypes } = require("sequelize");
const getSequelize = require("../../../global/config/getSequelize");

class CustomRate extends Model {}

CustomRate.init({
    customRateId: {
        field: "custom_rate_id",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    serviceId: {
        field: "service_id",
        unique: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    timestamp: true,
    modelName: "custom_rate",
    tableName: "custom_rate",
    sequelize: getSequelize()
})

module.exports = CustomRate