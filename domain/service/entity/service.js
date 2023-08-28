const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../global/config/getSequelize")();
const status = require("../../../global/entity/status");

class Service extends Model { }

Service.init({
    serviceId: {
        field: "service_id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    providerId: {
        field: "provider_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryId: {
        field: "category_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    apiServiceId: {
        field: "api_service_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    rate: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0
    },
    min: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    max: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    description: {
        type: DataTypes.STRING(200),
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(status),
        defaultValue: status.deactive
    },
    originalRate: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize,
    modelName: "service",
    tableName: "service"
})

module.exports = Service