'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entities', {
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
      },
      Initials: {
        type: Sequelize.STRING,
      },
      Nickname: {
        type: Sequelize.STRING,
      },
      EntityType: {
        type: Sequelize.STRING,
      },
      FundationAt: {
        type: Sequelize.DATEONLY,
      },
      Email: {
        type: Sequelize.STRING
      },
      Website: {
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
    await queryInterface.dropTable('entities');
  }
};
