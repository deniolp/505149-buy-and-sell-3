'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`../models/aliases`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({
  name: `data-service-offer`
});

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.offer;
    this._Comment = sequelize.models.comment;
    this._Category = sequelize.models.category;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    const order = [[`created_date`, `DESC`]];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    const offers = await this._Offer.findAll({include, order});
    return offers.map((item) => item.get());
  }

  async findPage({limit, offset, comments}) {
    const include = [Aliase.CATEGORIES];
    const order = [[`created_date`, `DESC`]];

    if (comments) {
      include.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include,
      order,
      distinct: true
    });
    return {count, offers: rows};
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedRow = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRow;
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    return await this._Offer.findByPk(id, {include});
  }

  async update(id, offer) {
    try {
      const [affectedRows] = await this._Offer.update(offer, {
        where: {id},
      });
      const offerCategories = await this._Category.findAll({
        where: {
          id: {
            [Op.or]: offer.categories,
          },
        }
      });
      const updatedOffer = await this._Offer.findByPk(id);
      await updatedOffer.setCategories(offerCategories);

      return !!affectedRows;
    } catch (error) {
      return logger.error(error);
    }
  }

}

module.exports = OfferService;
