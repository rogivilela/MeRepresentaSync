'use strict';

const { sequelize } = require("../../models/Person");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('proposals', 'LastUpdate', {
      type: Sequelize.DATE,
      after: "Keywords"
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proposals', 'LastUpdate');
  }
};
