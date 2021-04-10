'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('proposals', 'Keywords', {
      type: Sequelize.TEXT,
      after: "CurrentProposal"
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proposals', 'Keywords');
  }
};
