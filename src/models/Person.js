const { Model, DataTypes } = require('sequelize');

class Person extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV1
            },
            Name: DataTypes.STRING,
            FullName: DataTypes.STRING,
            Birthdate: DataTypes.DATEONLY,
            Email: DataTypes.STRING,
            IdDocument: DataTypes.STRING,
            UrlPicture: DataTypes.STRING,
            Source: DataTypes.INTEGER
        }, {
            sequelize
        })

    }
    static associate(models) {
        this.hasMany(models.Cost, { foreignKey: 'PersonId', as: 'CostsFK' });
    }
}

module.exports = Person;