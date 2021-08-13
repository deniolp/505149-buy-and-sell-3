'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const user = require(`../api/user`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
  UserService,
} = require(`../data-service`);

defineModels(sequelize);

const createApi = async () => {
  const agregatingRouter = new Router();

  category(agregatingRouter, new CategoryService(sequelize));
  offer(agregatingRouter, new OfferService(sequelize), new CommentService(sequelize));
  search(agregatingRouter, new SearchService(sequelize));
  user(agregatingRouter, new UserService(sequelize));

  return agregatingRouter;
};

module.exports = createApi;
