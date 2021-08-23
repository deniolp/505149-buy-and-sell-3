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
    this._User = sequelize.models.user;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES, {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];
    const order = [[`created_date`, `DESC`]];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    const offers = await this._Offer.findAll({include, order});
    return offers.map((item) => item.get());
  }

  async findPage({limit, offset, comments}) {
    const include = [Aliase.CATEGORIES, {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];
    const order = [[`created_date`, `DESC`]];

    if (comments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
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

  async findAllByUser(userId) {
    const include = [{
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    },
    {
      model: this._Comment,
      as: Aliase.COMMENTS,
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      where: {
        userId
      }
    }];

    const order = [[`created_date`, `DESC`]];
    const offers = await this._Offer.findAll({include, order});
    return offers.map((item) => item.get());
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
    const include = [Aliase.CATEGORIES, {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    return await this._Offer.findByPk(id, {include});
  }

  async findByCategory({limit, offset, categoryId}) {
    const include = [Aliase.CATEGORIES, Aliase.COMMENTS, {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];
    const {count, rows} = await this._Offer.findAndCountAll({
      attributes: [`id`],
      include: [{
        model: this._Category,
        as: Aliase.CATEGORIES,
        attributes: [],
        where: {
          id: categoryId
        },
      }],
      limit,
      offset,
      raw: true
    });

    const offers = await this._Offer.findAll({
      include,
      where: {
        id: {
          [Op.in]: rows.map((it) => it.id)
        }
      },
    });

    return {count, offers};
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
