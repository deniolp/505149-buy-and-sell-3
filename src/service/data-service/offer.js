'use strict';

class OfferService {
  constructor(db, logger) {
    this._db = db;
    this._logger = logger;
  }

  async create(offer) {
    const {sequelize} = this._db;
    const {Category, Offer, User} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (offer.category.filter((cat) => cat === item.title).length) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    try {
      const offerCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });

      const user = await User.findByPk(1);
      const newOffer = await user.createOffer(offer);
      await newOffer.addCategories(offerCategories);

      return await Offer.findByPk(newOffer.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not create offer. Error: ${error}`);

      return null;
    }
  }

  delete(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      this._logger.error(`Did not find offer`);
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  async findAll() {
    const {Offer} = this._db.models;

    try {
      const offers = await Offer.findAll();
      const preparedOffers = [];

      for (const offer of offers) {
        const categories = await offer.getCategories({raw: true});
        const comments = await offer.getComments({raw: true});
        offer.dataValues.category = categories;
        offer.dataValues.comments = comments;
        preparedOffers.push(offer.dataValues);
      }

      return preparedOffers;
    } catch (error) {
      this._logger.error(`Can not find offers. Error: ${error}`);
      return [];
    }
  }

  async findOne(id) {
    const {Offer} = this._db.models;
    const offerId = Number.parseInt(id, 10);

    try {
      const offer = await Offer.findByPk(offerId);
      const categories = await offer.getCategories({raw: true});
      offer.dataValues.category = categories;
      return offer.dataValues;
    } catch (error) {
      this._logger.error(`Can not find offer. Error: ${error}`);
      return null;
    }
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer, offer);
  }

}

module.exports = OfferService;
