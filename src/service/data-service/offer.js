'use strict';

// const {Op} = require(`sequelize`);

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

  async delete(id) {
    const {Offer} = this._db.models;

    try {
      const offerForDelete = await Offer.findByPk(id, {raw: true});
      const deletedRows = await Offer.destroy({
        returning: true,
        where: {
          id,
        }
      });

      if (!deletedRows) {
        return null;
      }

      return offerForDelete;
    } catch (error) {
      logger.error(`Can not delete offer. Error: ${error}`);

      return null;
    }
  }

  async findCommentsPage({limit, offset, page}) {
    const {Offer, Comment, Category} = this._db.models;

    try {
      const count = await Offer.count();
      const rows = await Offer.findAll({
        include: [
          {
            model: Comment,
            as: `comments`,
          },
          {
            model: Category,
            as: `categories`,
          }
        ],
      });
      const allComments = rows.reduce((acc, it) => {
        it.dataValues.comments.forEach((item) => acc.push(item.dataValues));
        return acc;
      }, []);
      allComments.sort((a, b) => b[`created_date`] - a[`created_date`]);
      const offersIds = new Set(allComments.reduce((acc, it) => {
        acc.push(it[`offer_id`]);
        return acc;
      }, []));
      let sortedOffers = [];
      for (const id of offersIds) {
        const offer = await Offer.findByPk(id, {
          include: [
            {
              model: Comment,
              as: `comments`,
            },
            {
              model: Category,
              as: `categories`,
            }
          ],
        });
        offer.dataValues.comments.sort((a, b) => b.dataValues[`created_date`] - a.dataValues[`created_date`]);
        sortedOffers.push(offer);
      }
      const slicedOffers = sortedOffers.slice(offset, limit * page);

      return {count, slicedOffers};
    } catch (error) {
      this._logger.error(`Can not find offers with comments. Error: ${error}`);

      return null;
    }
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    return await this._Offer.findByPk(id, {include});
  }

  async update(id, offer) {
    const {sequelize} = this._db;
    const {Offer, Category} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (offer.category.filter((cat) => +cat === +item.id).length) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    try {
      const [rows] = await Offer.update(offer, {
        where: {
          id,
        }
      });

      if (!rows) {
        return null;
      }

      const updatedOffer = await Offer.findByPk(id);
      const offerCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });
      await updatedOffer.setCategories(offerCategories);
      return await Offer.findByPk(updatedOffer.id, {
        include: [
          {
            model: Category,
            as: `categories`,
          }
        ],
      });
    } catch (error) {
      this._logger.error(`Can not update offer. Error: ${error}`);

      return null;
    }
  }

}

module.exports = OfferService;
