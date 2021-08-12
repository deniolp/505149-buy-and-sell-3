'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const sequelize = require(`../lib/sequelize`);
const {HttpCode, ExitCode} = require(`../../constants`);

describe(`Search API end-points:`, () => {
  const query = `Продам`;
  let app = null;
  let res;

  beforeAll(async () => {
    try {
      app = await createApp();
    } catch (error) {
      process.exit(ExitCode.error);
    }
  });

  afterAll(() => {
    sequelize.close();
  });

  test(`status code of get search query should be 200`, async () => {
    res = await request(app).get(encodeURI(`/api/search?query=${query}`));
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output have to contain array with search results`, async () => {
    res = await request(app).get(encodeURI(`/api/search?query=${query}`));

    expect(Array.isArray(res.body.foundOffers)).toBeTruthy();
  });

  test(`output have to contain count of offers that were found`, async () => {
    res = await request(app).get(encodeURI(`/api/search?query=${query}`));

    expect(res.body.count).toBeGreaterThan(0);
  });

  test(`each item of search results should have title property`, async () => {
    res = await request(app).get(encodeURI(`/api/search?query=${query}`));
    const response = res.body.foundOffers;
    for (const item of response) {
      expect(item).toHaveProperty(`title`);
    }
  });

  test(`should return empty array as search result after wrong request`, async () => {
    res = await request(app).get(encodeURI(`/api/search?query=kjbjhbwj`));

    expect(res.body.foundOffers).toStrictEqual([]);
  });
});
