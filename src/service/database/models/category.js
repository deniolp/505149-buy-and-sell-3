'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createCategoryModel: (sequelize) => {
    class Category extends Model {}

    Category.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(50), /* eslint-disable-line */
        allowNull: false,
      },
      picture: {
        type: DataTypes.TEXT,
      },
    }, {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `category`,
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
