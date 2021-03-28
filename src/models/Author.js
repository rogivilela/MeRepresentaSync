const { Model, DataTypes } = require('sequelize');

class Author extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV1
            },
            // ProposalId: DataTypes.UUID,
            // PersonId: DataTypes.UUID,
            // EntityId: DataTypes.UUID,
            Type: DataTypes.INTEGER,
            Name: DataTypes.STRING,
            ExternalId: DataTypes.INTEGER,
            OrderSignature: DataTypes.INTEGER
        }, {
            sequelize
        })

    }
    // static associate(models) {
    //     this.hasMany(models.Cost, { foreignKey: 'PersonId', as: 'CostsFK' });
    //     this.belongsToMany(models.Proposal, { foreignKey: 'PersonId', through: 'authors', as: 'ProposalsFK' });

    // }
}

module.exports = Author;