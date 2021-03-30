'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('people', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
      },
      Name: {
        type: Sequelize.STRING
      },
      FullName: {
        type: Sequelize.STRING,
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

    }, {
      uniqueKeys: {
        uniquePerson: {
          fields: ['FullName', 'Birthdate']
        }
      }
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('people');

  }
};
