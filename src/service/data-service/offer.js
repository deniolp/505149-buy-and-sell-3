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
      this._logger.error(`Can not delete offer. Error: ${error}`);

      return null;
    }
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

  async findPage({limit, offset}) {
    const {Offer} = this._db.models;

    try {
      const {count, rows} = await Offer.findAndCountAll({
        limit,
        offset,
      });
      const offers = [];

      for (const offer of rows) {
        const categories = await offer.getCategories({raw: true});
        const comments = await offer.getComments({raw: true});
        offer.dataValues.category = categories;
        offer.dataValues.comments = comments;
        offers.push(offer.dataValues);
      }
      return {count, offers};
    } catch (error) {
      this._logger.error(`Can not find offers. Error: ${error}`);

      return null;
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

  async update(id, offer) {
    const {sequelize} = this._db;
    const {Offer, Category} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (offer.category.filter((cat) => cat === item.title).length) {
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
      await updatedOffer.addCategories(offerCategories);
      return await Offer.findByPk(updatedOffer.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not update offer. Error: ${error}`);

      return null;
    }
  }

}

module.exports = OfferService;
