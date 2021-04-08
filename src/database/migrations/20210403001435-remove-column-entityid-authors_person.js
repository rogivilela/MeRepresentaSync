'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('authors_person', 'EntityId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('authors_person', 'EntityId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'entities',
        key: 'Id'
      }
    });
  }
};
