'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Category extends Model {}
const define = (sequelize) => Category.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: `category`,
  tableName: `categories`,
  createdAt: false,
  updatedAt: false,
});

module.exports = define;
