const { Model, DataTypes } = require('sequelize');

class Deliberation extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            // ProposalId: DataTypes.UUID, nao precisa por 
            Description: DataTypes.STRING,
            Approved: DataTypes.BOOLEAN,
            ExternalId: DataTypes.STRING,
            Shift: DataTypes.INTEGER,
            Source: DataTypes.INTEGER
        }, {
            sequelize
        })

    }
    static associate(models) {
        this.belongsTo(models.Proposal, { foreignKey: 'ProposalId', as: 'ProposalsFK' });
    }
}

module.exports = Deliberation;