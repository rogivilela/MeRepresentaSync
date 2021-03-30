const { Model, DataTypes } = require('sequelize');

class Cost extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            // PersonId: DataTypes.UUID,
            TypePerson: DataTypes.STRING(5),
            Month: DataTypes.INTEGER,
            Year: DataTypes.INTEGER,
            Value: DataTypes.DOUBLE,
            UrlPicture: DataTypes.STRING,
            Invoice: DataTypes.STRING,
            Supplier: DataTypes.STRING,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Person, { foreignKey: 'PersonId', as: 'PersonFK' });
    }
}

module.exports = Cost;