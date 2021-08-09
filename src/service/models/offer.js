'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Offer extends Model {}

const define = (sequelize) => Offer.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  createdAt: `created_date`,
  modelName: `offer`,
  tableName: `offers`
});

module.exports = define;
