'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createCategoryModel: (sequelize) => {
    class Category extends Model {}

    Category.init({
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `category`,
      tableName: `categories`,
    });

    return Category;
  },

  createCategoryLinks: (Offer, Category) => {
    Category.belongsToMany(Offer, {
      through: `offers_categories`,
      foreignKey: `category_id`,
      timestamps: false,
      paranoid: false,
    });
  }
};
