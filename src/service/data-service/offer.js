'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);

class OfferService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  create(offer) {
    const newOffer = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

    this._offers.push(newOffer);
    return newOffer;
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
    const {Offer} = this._models;

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
    const {Offer} = this._models;
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
