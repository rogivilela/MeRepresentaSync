const { Model, DataTypes } = require('sequelize');

class Proposal extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            Type: DataTypes.STRING(5),
            Number: DataTypes.INTEGER,
            Year: DataTypes.INTEGER,
            Description: DataTypes.TEXT,
            ExternalIdCamara: DataTypes.INTEGER,
            ExternalIdSenado: DataTypes.INTEGER,
            DescriptionDetailed: DataTypes.TEXT,
            Justification: DataTypes.TEXT,
            Text: DataTypes.TEXT,
            UrlDocment: DataTypes.STRING,
            CurrentProposal: DataTypes.BOOLEAN,
        }, {
            sequelize
        })

    }
    static associate(models) {
        this.belongsToMany(models.Person, { foreignKey: 'ProposalId', through: 'authors', as: 'PeopleFK' });
    }
}

module.exports = Proposal;