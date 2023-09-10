'use strict';

const type = require('../domain/provider/entity/constant/type');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("provider", "type", {
      type: Sequelize.BOOLEAN,
      defaultValue: type.json
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("provider", "type")
  }
};
