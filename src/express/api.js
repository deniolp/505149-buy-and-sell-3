'use strict';

const axios = require(`axios`).default;

const {API_PORT, APP_URL} = require(`../../config`);
const {TIMEOUT, HttpMethod} = require(`../constants`);

const port = API_PORT || 3000;
const defaultUrl = `${APP_URL}:${port}/api/`;

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

  getOffers({offset, limit, comments}) {
    return this._load(`/offers`, {params: {offset, limit, comments}});
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

  async createOffer(data) {
    return this._load(`/offers`, {
      method: HttpMethod.POST,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
