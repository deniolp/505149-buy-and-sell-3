'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

defineModels(sequelize);

const createApi = async (logger) => {
  const agregatingRouter = new Router();

  category(agregatingRouter, new CategoryService(sequelize, logger));
  offer(agregatingRouter, new OfferService(sequelize, logger), new CommentService(sequelize, logger));
  search(agregatingRouter, new SearchService(sequelize, logger));

  return agregatingRouter;
};

module.exports = createApi;
