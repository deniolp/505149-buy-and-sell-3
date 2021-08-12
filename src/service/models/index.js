'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineUser = require(`./user`);
const Aliase = require(`./aliases`);

class OfferCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Offer, {
    as: Aliase.OFFERS,
    foreignKey: `userId`,
  });
  Offer.belongsTo(User, {
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`,
  });
  Comment.belongsTo(User, {
    foreignKey: `userId`
  });

  Offer.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `offerId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(Offer, {
    foreignKey: `offerId`
  });

  OfferCategory.init({}, {
    sequelize,
    modelName: `offers_categories`,
  });

  Offer.belongsToMany(Category, {
    through: `offers_categories`,
    as: Aliase.CATEGORIES
  });
  Category.belongsToMany(Offer, {
    through: `offers_categories`,
    as: Aliase.OFFERS
  });
  Category.hasMany(OfferCategory, {
    as: Aliase.OFFERS_CATEGORIES
  });

  return {Category, Comment, User, Offer, OfferCategory};
};

module.exports = define;
