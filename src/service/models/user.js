'use strict';

const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}
const define = (sequelize) => User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    // TODO: Как валидировать длину пароля?
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: `user`,
  tableName: `users`
});

module.exports = define;
