const { Model, DataTypes } = require("sequelize");
const newsType = require("./constant/newsType");
const newsStatus = require("./constant/newsStatus");
const sequelize = require('../../../global/config/getSequelize')()

class News extends Model {}

News.init({
    newsId: {
        field: "news_id",
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    start: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date(),
        allowNull: false,
    },
    end: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date(),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(Object.values(newsStatus)),
        defaultValue: newsStatus.deactive
    },
    type: {
        type: DataTypes.ENUM(Object.values(newsType)),
        defaultValue: newsType.accouncement
    }
}, {
    sequelize,
    timestamps: true,
    modelName: "news",
    tableName: "news"
})

module.exports = News