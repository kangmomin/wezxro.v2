'use strict';

const type = require('../domain/provider/entity/constant/type');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("depoist", "note", {
      type: Sequelize.TEXT
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("depoist", "note")
  }
};
