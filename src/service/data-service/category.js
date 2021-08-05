'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`../models/aliases`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.category;
    this._OfferCategory = sequelize.models.offers_categories;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `title`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`category.id`)],
        include: [{
          model: this._OfferCategory,
          as: Aliase.OFFERS_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
