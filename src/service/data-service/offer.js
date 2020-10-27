'use strict';

const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../lib/logger`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);

const logger = getLogger({
  name: `api-server`,
});

class OfferService {
  constructor(offers) {
    this._offers = offers;
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
      logger.error(`Did not find offer`);
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer, offer);
  }

}

module.exports = OfferService;
