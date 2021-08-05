'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliases`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `init-db`});

module.exports = async (sequelize, {categories, offers, users}) => {
  try {
    const {Category, Offer, User} = defineModels(sequelize);
    const result = await sequelize.sync({force: true});
    logger.info(`Successfully created ${result.config.database} database`);

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({
          title: item,
          picture: `picture.png`,
        }))
    );

    const categoryIdByName = categoryModels.reduce((acc, next) => ({
      [next.title]: next.id,
      ...acc
    }), {});

    console.log(categoryIdByName);

    const userModels = await User.bulkCreate(users, {include: [Aliase.OFFERS, Aliase.COMMENTS]});

    const userIdByEmail = userModels.reduce((acc, next) => ({
      [next.email]: next.id,
      ...acc
    }), {});

    console.log(userIdByEmail);

    offers.forEach((offer) => {
      offer.userId = userIdByEmail[offer.user];
      offer.comments.forEach((comment) => {
        comment.userId = userIdByEmail[comment.user];
      });
    });

    const offerPromises = offers.map(async (offer) => {
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
      await offerModel.addCategories(
          offer.categories.map(
              (title) => categoryIdByName[title]
          )
      );
    });
    await Promise.all(offerPromises);

    logger.info(`Successfully filled ${result.config.database} database`);
  } catch (error) {
    logger.error(error);
  }
};
