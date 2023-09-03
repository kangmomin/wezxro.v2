'use strict';

const sequelize = require('../global/config/getSequelize')();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    
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

      await queryInterface.addColumn("account", "custom_rate", {
        type: DataTypes.FLOAT,
        defaultValue: null,
        allowNull: true,
      })

      for(let i = 1; i <= 100; i++) { // 예시로 1부터 10까지의 name_X 인덱스를 삭제합니다.
        try {
          await queryInterface.removeIndex('category', `name_${i}`)
        } catch(e) {
          continue
        }
      }
      
      try {
        await queryInterface.removeIndex("category", "name")
      } catch(e) {}

      await queryInterface.addColumn("account", "ip", {
        type: DataTypes.STRING
      })
      await queryInterface.addColumn("account", "pNumber", {
        type: DataTypes.STRING(11)
      })
    },
    
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("custom_rate")
    await queryInterface.removeColumn("account", "custom_rate")
    await queryInterface.removeColumn("account", "ip")
    await queryInterface.removeColumn("account", "pNumber")
  }
};
