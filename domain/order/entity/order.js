const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../global/config/getSequelize")()

class Order extends Model {}

Order.init({
    orderId: {
        field: "order_id",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    serviceId: {
        field: "service_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryId: {
        field: "category_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    apiOrderId: {
        field: "api_order_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalCharge: {
        field: "total_charge",
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    link: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    timestamps: true,
    modelName: "order",
    tableName: "order"
})

module.exports = Order