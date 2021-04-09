'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('votes', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
      },
      DeliberationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'deliberations',
          key: 'Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      PersonId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'people',
          key: 'Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Value: {
        type: Sequelize.STRING,
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
          fields: ['DeliberationId', 'PersonId']
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('votes');

  }
};
