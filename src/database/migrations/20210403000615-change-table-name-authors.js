'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.renameTable('authors', 'authors_person');


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('authors_person', 'authors');

  }
};
