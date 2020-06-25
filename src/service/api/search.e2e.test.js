'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);

describe(`Search API end-points:`, () => {
  const query = `Продам`;
  let app = null;
  let res;

  beforeAll(async () => {
    app = await createApp();
    res = await request(app).get(encodeURI(`/api/search?query=${query}`));
  });

  test(`status code of get search query should be 200`, async () => {
    expect(res.statusCode).toBe(200);
  });

  test(`output have to be array`, () => {
    if (res.body) {
      expect(Array.isArray(res.body)).toBeTruthy();
    }
  });

  test(`each item of output should have title property`, () => {
    const response = res.body;
    if (response) {
      for (const item of response) {
        expect(item).toHaveProperty(`title`);
      }
    }
  });
});
