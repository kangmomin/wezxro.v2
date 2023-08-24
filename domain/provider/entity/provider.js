const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../global/config/getSequelize')()
const status = require('../../../global/entity/status')

class Provider extends Model { }

Provider.init({
    providerId: {
        field: "provider_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    apiKey: {
        field: "api_key",
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apiUrl: {
        field: "api_url",
        unique: true,
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: Object.values(status)
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'provider',
    tableName: 'provider'
})

module.exports = Provider