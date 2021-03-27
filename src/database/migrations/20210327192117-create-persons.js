'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('people', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
      },
      Name: {
        type: Sequelize.STRING
      },
      FullName: {
        type: Sequelize.STRING,
        unique: 'uniquePerson',
      },
      Birthdate: {
        type: Sequelize.DATEONLY,
        unique: 'uniquePerson',
      },
      Email: {
        type: Sequelize.STRING
      },
      IdDocument: {
        type: Sequelize.STRING
      },
      UrlPicture: {
        type: Sequelize.STRING
      },
      Source: {
        type: Sequelize.INTEGER
      },
      CreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('people');

  }
};
