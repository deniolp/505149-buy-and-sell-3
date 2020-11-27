'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createOfferModel: (sequelize) => {
    class Offer extends Model {}

    Offer.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: [`buy`, `offer`],
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100), /* eslint-disable-line */
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000), /* eslint-disable-line */
        allowNull: false,
      },
      sum: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      picture: {
        type: DataTypes.TEXT,
      },
    }, {
      sequelize,
      createdAt: `created_date`,
      updatedAt: false,
      paranoid: false,
      modelName: `offer`,
    });

    return Offer;
  },

  createOfferLinks: (Offer, User, Category, Comment) => {
    Offer.hasMany(Comment, {
      as: `comments`,
      foreignKey: `offer_id`,
    });
    Offer.belongsTo(User, {
      foreignKey: `user_id`,
      as: `user`,
    });
    Offer.belongsToMany(Category, {
      through: `offers_categories`,
      foreignKey: `offer_id`,
      timestamps: false,
      paranoid: false,
    });
  }
};
