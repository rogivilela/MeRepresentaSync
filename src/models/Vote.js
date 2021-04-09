const { Model, DataTypes } = require('sequelize');

class Vote extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            // DeliberationId: DataTypes.UUID, nao precisa por 
            // PersonId: DataTypes.UUID, nao precisa por 
            Value: DataTypes.STRING,
        }, {
            sequelize
        })

    }
    static associate(models) {
        this.belongsTo(models.Person, { foreignKey: 'PersonId', as: 'PersonFK' });
        this.belongsTo(models.Deliberation, { foreignKey: 'DeliberationId', as: 'DeliberationFK' });
    }
}

module.exports = Vote;