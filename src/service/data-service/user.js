'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.user;
  }

  async create(userData) {
    const user = await this._User.create(userData);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });
    return user && user.get();
  }
}

module.exports = UserService;
