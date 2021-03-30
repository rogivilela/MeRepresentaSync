'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('costs', {
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
      TypePerson: {
        type: Sequelize.STRING(5),
      },
      Month: {
        type: Sequelize.INTEGER,
      },
      Year: {
        type: Sequelize.INTEGER,
      },
      Value: {
        type: Sequelize.DOUBLE,
      },
      UrlPicture: {
        type: Sequelize.STRING,
      },
      Invoice: {
        type: Sequelize.STRING
      },
      Supplier: {
        type: Sequelize.STRING
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
        uniqueCost: {
          fields: ['PersonId', 'Invoice', 'Supplier', 'TypePerson']
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('costs');
  }
};
