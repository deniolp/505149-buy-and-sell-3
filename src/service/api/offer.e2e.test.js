'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const {HttpCode} = require(`../../constants`);

const offerMock = {
  "id": `1`,
  "title": `Title`,
  "picture": `01.jpg`,
  "description": `Some description`,
  "type": `offer`,
  "sum": 1,
  "category": [
    `Журналы`,
  ],
  "comments": [
    {
      "id": `1`,
      "text": `Some comment`
    }
  ],
};

let app = null;

beforeAll(async () => {
  app = await createApp();
});

describe(`Offer API end-points:`, () => {
  let res;

  test(`status code of GET offer query should be 200`, async () => {
    res = await request(app).get(`/api/offers`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/offers`);
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`status code for wrong GET offer request should be 404`, async () => {
    res = await request(app).get(`/api/offers/xx`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code for POST offer request should be 201`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send(offerMock);

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code for incorrect POST offer query should be 400`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send({"some": `some`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`status code for GET offer query by id should be 200`, async () => {
    res = await request(app).get(`/api/offers/${offerMock.id}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`PUT request should work and status code  should be 200`, async () => {
    res = await request(app)
      .put(`/api/offers/${offerMock.id}`)
      .send({
        "id": `1`,
        "title": `Title`,
        "picture": `01.jpg`,
        "description": `Some description`,
        "type": `offer`,
        "sum": 999,
        "category": [
          `Журналы`,
        ],
        "comments": [
          {
            "id": `1`,
            "text": `Some comment`
          }
        ],
      });
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body.sum).toBe(999);
  });

  test(`wrong PUT request should not work and status code  should be 400`, async () => {
    res = await request(app)
      .put(`/api/offers/${offerMock.id}`)
      .send({
        "id": `1`,
        "title": `Title`,
      });
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`DELETE offer request should work and status code after deleting should be 200`, async () => {
    res = await request(app).get(`/api/offers`);
    const firstLength = res.body.length;

    res = await request(app).delete(`/api/offers/${offerMock.id}`);
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get(`/api/offers`);
    expect(res.body.length).toBe(firstLength - 1);
  });

  test(`status for incorrect DELETE offer request should be 404`, async () => {
    res = await request(app).delete(`/api/offers/xx`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});

describe(`Offer comments API end-points`, () => {
  let res;

  test(`status code after GET request for comments should be 200 and `, async () => {
    await request(app)
      .post(`/api/offers`)
      .send(offerMock);
    res = await request(app).get((`/api/offers/${offerMock.id}/comments`));

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET for comments should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/offers/${offerMock.id}/comments`);
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`status code after request of comments with wrong offer id should be 404`, async () => {
    res = await request(app).get((`/api/offers/xx/comments`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code after POST comment request should be 201`, async () => {
    res = await request(app)
      .post((`/api/offers/${offerMock.id}/comments`))
      .send({
        "text": `Some text`,
      });

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code after wrong POST request of comment should be 400`, async () => {
    res = await request(app)
      .post((`/api/offers/${offerMock.id}/comments`))
      .send({
        "some": `Some`,
      });

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`delete comment request should delete comment and status code after should be 200`, async () => {
    res = await request(app).delete((`/api/offers/${offerMock.id}/comments/1`));
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get((`/api/offers/${offerMock.id}/comments`));
    expect(res.body.length).toBe(1);
  });

  test(`status code after delete comment request with wrong comment id should return 404`, async () => {
    res = await request(app).delete((`/api/offers/${offerMock.id}/comments/xx`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
