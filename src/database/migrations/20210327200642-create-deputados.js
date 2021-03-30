'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deputados', {
      Id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
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
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      FullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Party: {
        type: Sequelize.STRING,
      },
      State: {
        type: Sequelize.STRING(2)
      },
      UrlPicture: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      ExternalId: {
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
        uniqueDeputado: {
          fields: ['PersonId']
        }
      }
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('deputados');
  }
};
