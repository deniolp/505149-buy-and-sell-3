'use strict';

class CategoryService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll() {
    const {Category} = this._models;
    try {
      return await Category.findAll({raw: true});
    } catch (error) {
      this._logger.error(`Can not find categories. Error: ${error}`);

      return null;
    }
  }
}

module.exports = CategoryService;
