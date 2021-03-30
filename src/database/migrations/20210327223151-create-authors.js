'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authors', {
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
      PersonId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'people',
          key: 'Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      EntityId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'entities',
          key: 'Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Type: {
        type: Sequelize.INTEGER,
      },
      Name: {
        type: Sequelize.STRING,
      },
      ExternalId: {
        type: Sequelize.INTEGER,
      },
      OrderSignature: {
        type: Sequelize.INTEGER,
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
        uniqueAuthor: {
          fields: ['ProposalId', 'PersonId', 'EntityId']
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authors');
  }
};
