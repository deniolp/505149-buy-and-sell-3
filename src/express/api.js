'use strict';

const axios = require(`axios`).default;

const {API_PORT, API_URL} = require(`../../config`);
const {TIMEOUT, HttpMethod} = require(`../constants`);

const port = API_PORT;
const defaultUrl = `${API_URL}:${port}/api`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({offset, limit, comments, userId}) {
    return this._load(`/offers`, {params: {offset, limit, comments, userId}});
  }

  getOffer(id, comments) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }

  updateOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  search({offset, limit, query}) {
    return this._load(`/search`, {params: {offset, limit, query}});
  }

  async getCategories(needCount) {
    return this._load(`/categories`, {params: {needCount}});
  }

  async getOffersByCategory({id, offset, limit}) {
    return this._load(`/offers/category/${id}`, {params: {offset, limit}});
  }

  async createOffer(data) {
    return this._load(`/offers`, {
      method: HttpMethod.POST,
      data
    });
  }

  async deleteOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.DELETE,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async deleteComment(id, data) {
    return this._load(`/offers/comments/${id}`, {
      method: HttpMethod.DELETE,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
