'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const {HttpCode} = require(`../../constants`);

describe(`Search API end-points:`, () => {
  const query = `Продам`;
  let app = null;
  let res;

  beforeAll(async () => {
    app = await createApp();
  });

  test(`status code of get search query should be 200`, async () => {
    res = await request(app).get(encodeURI(`/api/search?search=${query}`));
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output have to be array`, async () => {
    res = await request(app).get(encodeURI(`/api/search?search=${query}`));
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`each item of output should have title property`, async () => {
    res = await request(app).get(encodeURI(`/api/search?search=${query}`));
    const response = res.body;
    for (const item of response) {
      expect(item).toHaveProperty(`title`);
    }
  });

  test(`should return 400 status for empty request`, async () => {
    res = await request(app).get(encodeURI(`/api/search?search=`));

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`should return 404 status for wrong request`, async () => {
    res = await request(app).get(encodeURI(`/api/search?search=${null}`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
