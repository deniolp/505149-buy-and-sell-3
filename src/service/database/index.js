'use strict';

const Sequelize = require(`sequelize`);

const {createUserModel} = require(`./models/user`);
const {createOfferModel} = require(`./models/offer`);
const {createCategoryModel} = require(`./models/category`);
const {createCommentModel} = require(`./models/comment`);
const {getLogger} = require(`../lib/logger`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT} = require(`../../../config`);

const logger = getLogger({
  name: `db-server`,
});

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: (msg) => logger.debug(msg),
});

const User = createUserModel(sequelize);
const Offer = createOfferModel(sequelize);
const Category = createCategoryModel(sequelize);
const Comment = createCommentModel(sequelize);

module.exports = {
  sequelize,
  models: {
    User,
    Offer,
    Category,
    Comment,
  },
};
