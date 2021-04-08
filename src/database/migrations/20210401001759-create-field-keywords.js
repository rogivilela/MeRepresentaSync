'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('proposals', 'Keywords', {
      type: Sequelize.STRING
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proposals', 'Keywords');
  }
};
