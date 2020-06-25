'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);

describe(`Categories API end-points`, () => {
  test(`When get categories status code should be 200`, async () => {
    const app = await createApp();
    const res = await request(app).get(`/api/categories`);
    expect(res.statusCode).toBe(200);
  });
});
