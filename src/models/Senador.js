const { Model, DataTypes } = require('sequelize');

class Senador extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            // PersonId: DataTypes.UUID,
            Name: DataTypes.STRING,
            FullName: DataTypes.STRING,
            Party: DataTypes.STRING,
            State: DataTypes.STRING(2),
            UrlPicture: DataTypes.STRING,
            Email: DataTypes.STRING,
            ExternalId: DataTypes.INTEGER,
        }, {
            tableName: 'Senadores',
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Person, { foreignKey: 'PersonId', as: 'PersonFK' });
    }
}

module.exports = Senador;