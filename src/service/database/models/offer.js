'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createOfferModel: (sequelize) => {
    class Offer extends Model {}

    Offer.init({
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sum: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      createdAt: `created_date`,
      updatedAt: false,
      paranoid: false,
      modelName: `offer`,
      tableName: `offers`,
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
