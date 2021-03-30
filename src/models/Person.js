const { Model, DataTypes } = require('sequelize');

class Person extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
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
        this.belongsToMany(models.Proposal, { foreignKey: 'PersonId', through: 'authors', as: 'ProposalsFK' });
    }
}

module.exports = Person;