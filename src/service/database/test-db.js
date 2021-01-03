'use strict';

const Sequelize = require(`sequelize`);

const {createUserModel, createUserLinks} = require(`./models/user`);
const {createOfferModel, createOfferLinks} = require(`./models/offer`);
const {createCategoryModel, createCategoryLinks} = require(`./models/category`);
const {createCommentModel, createCommentLinks} = require(`./models/comment`);
const {TEST_DB_NAME, DB_USER, TEST_DB_PASSWORD, DB_HOST, DB_DIALECT} = require(`../../../config`);

const sequelize = new Sequelize(TEST_DB_NAME, DB_USER, TEST_DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

const User = createUserModel(sequelize);
const Offer = createOfferModel(sequelize);
const Category = createCategoryModel(sequelize);
const Comment = createCommentModel(sequelize);

createUserLinks(Offer, User, Comment);
createOfferLinks(Offer, User, Category, Comment);
createCategoryLinks(Offer, Category);
createCommentLinks(Comment, User, Offer);

module.exports = {
  sequelize,
  models: {
    User,
    Offer,
    Category,
    Comment,
  },
};
