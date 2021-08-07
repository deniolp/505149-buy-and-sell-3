'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const sequelize = require(`../lib/sequelize`);
const {HttpCode, ExitCode} = require(`../../constants`);

const mockOffer = {
  "title": `Title is enough long`,
  "picture": `02.jpg`,
  "description": `Some description, yes, some description, do not be surprised!`,
  "type": `offer`,
  "sum": 200,
  "categories": [2],
  "userId": 1
};

let app = null;
let mockOfferId;
let mockCommentId;

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

describe(`Offer API end-points:`, () => {
  let res;

  test(`status code of GET offers query should be 200`, async () => {
    res = await request(app).get(`/api/offers`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/offers`);

    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`output after GET offers with limit and offset should have an array with at least length 1`, async () => {
    res = await request(app).get(`/api/offers`).query({limit: 8, offset: 0, comments: false});

    expect(res.body.offers.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.offers)).toBeTruthy();
  });

  test(`output after GET offers with limit and offset should have count of offers`, async () => {
    res = await request(app).get(`/api/offers`).query({limit: 8, offset: 0, comments: false});

    expect(res.body.count).toBeGreaterThan(0);
  });

  test(`status code for wrong GET offer request should be 404`, async () => {
    res = await request(app).get(`/api/offers/999999`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code for POST offer request should be 201`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send(mockOffer);

    mockOfferId = res.body.id;

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code for incorrect POST offer query should be 400`, async () => {
    const badOffers = [
      {...mockOffer, sum: true},
      {...mockOffer, picture: 12345},
      {...mockOffer, categories: `Котики`}
    ];

    for (const badOffer of badOffers) {
      res = await request(app).post(`/api/offers`).send(badOffer);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    }
  });

  test(`when field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...mockOffer, sum: -1},
      {...mockOffer, title: `too short`},
      {...mockOffer, categories: []}
    ];

    for (const badOffer of badOffers) {
      res = await request(app).post(`/api/offers`).send(badOffer);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    }
  });

  test(`status code for GET offer query by id should be 200`, async () => {
    res = await request(app).get(`/api/offers/${mockOfferId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`status code for GET offers with comments should be 200`, async () => {
    res = await request(app).get(`/api/offers`).query({comments: true});

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`output after GET offers with comments should have array with comments (at least 0, should be array)`, async () => {
    res = await request(app).get(`/api/offers`).query({comments: true});

    expect(Array.isArray(res.body[0].comments)).toBeTruthy();
  });

  test(`PUT request should work and status code should be 200`, async () => {
    res = await request(app)
      .put(`/api/offers/${mockOfferId}`)
      .send({
        "title": `Title is enough long`,
        "picture": `01.jpg`,
        "description": `New some description, yes, some description, do not be surprised!`,
        "type": `offer`,
        "sum": 999,
        "categories": [2],
        "userId": 1
      });

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after PUT request should have updated fields`, async () => {
    res = await request(app)
      .get(`/api/offers/${mockOfferId}`);

    expect(res.body.sum).toBe(999);
    expect(res.body.description).toBe(`New some description, yes, some description, do not be surprised!`);
    expect(res.body.categories[0].id).toBe(2);
  });

  test(`wrong PUT request should not work and status code  should be 400`, async () => {
    res = await request(app)
      .put(`/api/offers/${mockOfferId}`)
      .send({
        "title": `Title`,
      });
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`DELETE offer request should work and status code after deleting should be 200`, async () => {
    res = await request(app).delete(`/api/offers/${mockOfferId}`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`status for incorrect DELETE offer request should be 500`, async () => {
    res = await request(app).delete(`/api/offers/1000`);

    expect(res.statusCode).toBe(HttpCode.INTERNAL_SERVER_ERROR);
  });
});

describe(`Offer comments API end-points`, () => {
  let res;

  test(`status code after GET request for comments should be 200 and and output should be array`, async () => {
    res = await request(app)
      .post(`/api/offers`)
      .send(mockOffer);

    mockOfferId = res.body.id;
    res = await request(app).get((`/api/offers/${mockOfferId}/comments`));

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`status code after request of comments with wrong offer id should be 404`, async () => {
    res = await request(app).get((`/api/offers/1000/comments`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code after POST comment request should be 201`, async () => {
    res = await request(app)
      .post(`/api/offers/${mockOfferId}/comments`)
      .send({
        "text": `Это новый очень хороший комментарий!`,
        "userId": 1
      });

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code for incorrect POST comment request should be 400`, async () => {
    const badComments = [
      {
        "text": `Это новый очень хороший комментарий!`,
        "userId": `Странный id`
      },
      {
        "text": 12345,
        "userId": 1
      }
    ];

    for (const badComment of badComments) {
      res = await request(app).post(`/api/offers/${mockOfferId}/comments`).send(badComment);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    }
  });

  test(`when field value is wrong response code is 400`, async () => {
    res = await request(app).post(`/api/offers/${mockOfferId}/comments`).send({
      "text": `Очень короткий`,
      "userId": 1
    });

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`status code after wrong POST request of comment should be 400`, async () => {
    res = await request(app)
      .post((`/api/offers/${mockOfferId}/comments`))
      .send({
        "some": `Some`,
      });

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`delete comment request should delete comment and status code after should be 200`, async () => {
    res = await request(app)
    .post((`/api/offers/${mockOfferId}/comments`))
    .send({
      "text": `Это еще новый очень хороший комментарий!`,
      "userId": 2
    });
    mockCommentId = res.body.id;

    res = await request(app).delete((`/api/offers/${mockOfferId}/comments/${mockCommentId}`));
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get((`/api/offers/${mockOfferId}/comments`));
    expect(res.body.length).toBe(1);
  });

  test(`status code after delete comment request with wrong comment id should return 404`, async () => {
    res = await request(app).delete((`/api/offers/${mockOfferId}/comments/1000`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
