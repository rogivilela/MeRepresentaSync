const { Model, DataTypes } = require('sequelize');

class Entity extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            Name: DataTypes.STRING,
            FullName: DataTypes.STRING,
            Initials: DataTypes.STRING,
            Nickname: DataTypes.STRING,
            FundationAt: DataTypes.DATEONLY,
            Email: DataTypes.STRING,
            Website: DataTypes.STRING,
            UrlPicture: DataTypes.STRING,
            Source: DataTypes.INTEGER
        }, {
            sequelize
        })

    }
    static associate(models) {
        this.belongsToMany(models.Proposal, { foreignKey: 'EntityId', through: models.AuthorEntity, as: 'ProposalsFK' });
    }
}

module.exports = Entity;