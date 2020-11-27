'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createUserModel: (sequelize) => {
    class User extends Model {}

    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(50), /* eslint-disable-line */
        field: `first_name`,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50), /* eslint-disable-line */
        field: `last_name`,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50), /* eslint-disable-line */
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(50), /* eslint-disable-line */
        allowNull: false,
        // Как валидировать длину пароля?
      },
      avatar: {
        type: DataTypes.TEXT,
      },
    }, {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `user`,
    });

    return User;
  }
};
