'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('proposals', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
      },
      Type: {
        type: Sequelize.STRING(5),
        allowNull: false,
        unique: 'uniqueProposal',
      },
      Number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'uniqueProposal',
      },
      Year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'uniqueProposal',
      },
      Description: {
        type: Sequelize.TEXT,
      },
      ExternalIdCamara: {
        type: Sequelize.INTEGER
      },
      ExternalIdSenado: {
        type: Sequelize.INTEGER
      },
      DescriptionDetailed: {
        type: Sequelize.TEXT
      },
      Justification: {
        type: Sequelize.TEXT
      },
      Text: {
        type: Sequelize.TEXT
      },
      UrlDocment: {
        type: Sequelize.STRING
      },
      CurrentProposal: {
        type: Sequelize.BOOLEAN
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

    await queryInterface.dropTable('proposals');

  }
};
