'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const {sequelize} = require(`../database`);
const {HttpCode, ExitCode} = require(`../../constants`);

describe(`Categories API end-points:`, () => {
  let app = null;
  let res;

  beforeAll(async () => {
    try {
      app = await createApp();
      res = await request(app).get(`/api/categories`);
    } catch (error) {
      process.exit(ExitCode.error);
    }
  });

  afterAll(() => {
    sequelize.close();
  });

  test(`status code of get query should be 200`, () => {
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output should have at least one category`, () => {
    expect(res.body.length).toBeGreaterThan(0);
  });

  test(`each item of output have to be string`, () => {
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.every((it) => typeof it.title === `string`)).toBeTruthy();
  });
});
