'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('authors_person', 'Type');
    await queryInterface.removeColumn('authors_person', 'Name');
    await queryInterface.removeColumn('authors_person', 'ExternalId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('authors_person', 'Type', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('authors_person', 'Name', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('authors_person', 'ExternalId', {
      type: Sequelize.INTEGER
    });
  }
};
