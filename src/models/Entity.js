const { Model, DataTypes } = require('sequelize');

class Entity extends Model {
    static init(sequelize) {
        super.init({
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV1
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
}

module.exports = Entity;