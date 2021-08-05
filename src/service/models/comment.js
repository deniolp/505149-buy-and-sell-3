'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  createdAt: `created_date`,
  modelName: `comment`,
  tableName: `comments`
});

module.exports = define;
