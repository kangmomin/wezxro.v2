const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../global/config/getSequelize')()
const status = require('../../../global/entity/status')

class Category extends Model { }

Category.init({
    categoryId: {
        field: "category_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM(Object.values(status)),
        allowNull: false,
    }
}, {
    timestamps: true,
    sequelize,
    modelName: 'category',
    tableName: 'category'
})

module.exports = Category