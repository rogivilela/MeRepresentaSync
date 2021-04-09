'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deliberations', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
      },
      ProposalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'proposals',
          key: 'Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Description: {
        type: Sequelize.STRING,
      },
      Approved: {
        type: Sequelize.BOOLEAN
      },
      ExternalId: {
        type: Sequelize.STRING
      },
      Shift: {
        type: Sequelize.INTEGER
      },
      Source: {
        type: Sequelize.INTEGER
      },
      CreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }

    }, {
      uniqueKeys: {
        uniqueDeliberation: {
          fields: ['ProposalId', 'ExternalId']
        }
      }
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('deliberations');

  }
};
