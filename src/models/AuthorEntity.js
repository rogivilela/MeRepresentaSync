const { Model, DataTypes } = require('sequelize');
// const { tableName } = require('./Person');

class AuthorEntity extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: true,
            },
            // ProposalId: DataTypes.UUID,
            // PersonId: DataTypes.UUID,
            // EntityId: DataTypes.UUID,
            // Type: DataTypes.INTEGER,
            // Name: DataTypes.STRING,
            // ExternalId: DataTypes.INTEGER,
            OrderSignature: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'authors_entity'
        })

    }
    // static associate(models) {
    //     this.hasMany(models.Cost, { foreignKey: 'PersonId', as: 'CostsFK' });
    //     this.belongsToMany(models.Proposal, { foreignKey: 'PersonId', through: 'authors', as: 'ProposalsFK' });

    // }
}

module.exports = AuthorEntity;