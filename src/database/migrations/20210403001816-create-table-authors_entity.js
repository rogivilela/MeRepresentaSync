'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authors_entity', {
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
      tableName: 'authors_entity',
      uniqueKeys: {
        uniqueAuthor: {
          fields: ['ProposalId', 'EntityId']
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('authors_entity');

  }
};
