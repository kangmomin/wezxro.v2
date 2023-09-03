'use strict';

const sequelize = require('../global/config/getSequelize')();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    
    queryInterface.createTable("custom_rate", {
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
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
          allowNull: false,
        },
      }, {
        modelName: "custom_rate",
        tableName: "custom_rate",
        sequelize
      })

      queryInterface.addColumn("account", "custom_rate", {
        type: DataTypes.FLOAT,
        defaultValue: null,
        allowNull: true,
      })
    },
    
  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("custom_rate")
    queryInterface.removeColumn("account", "custom_rate")
  }
};
