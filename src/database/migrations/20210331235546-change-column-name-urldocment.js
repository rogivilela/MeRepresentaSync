'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('proposals', 'UrlDocment', 'UrlDocument');

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('proposals', 'UrlDocument', 'UrlDocment');
  }
};
