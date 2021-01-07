'use strict';

class CategoryService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll() {
    const {Category} = this._models;

    return await Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
