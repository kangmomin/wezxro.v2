'use strict';

const getSequelize = require('../global/config/getSequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn("account", "custom_rate", {
      field: "custom_rate",
      type: DataTypes.FLOAT,
      defaultValue: null,
      allowNull: true,
    })

    await queryInterface.createTable("custom_rate", {
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
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("custom_rate")
  }
};
