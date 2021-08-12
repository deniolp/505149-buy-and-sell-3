'use strict';

const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}
const define = (sequelize) => User.init({
  firstName: {
    type: DataTypes.STRING,
    field: `first_name`,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    field: `last_name`,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // TODO: Как валидировать длину пароля?
  },
  avatar: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: `user`,
  tableName: `users`
});

module.exports = define;
