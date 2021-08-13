'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const sequelize = require(`../lib/sequelize`);
const {HttpCode, ExitCode} = require(`../../constants`);

let app = null;

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

describe(`User API end-points:`, () => {
  let res;
  let userEmail;

  const validUserData = {
    name: `Сидор Сидоров`,
    email: `sidorov@exaple.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`
  };

  test(`API creates user if data is valid and return status code 201`, async () => {
    res = await request(app)
      .post(`/api/user`)
      .send(validUserData);

    userEmail = res.body.email;
    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`API refuses to create user if user (by his email) already exists and return status code 400`, async () => {
    res = await request(app)
      .post(`/api/user`)
      .send(validUserData);

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);

    await sequelize.models.user.destroy({
      where: {email: userEmail}
    });
  });

  test(`API refuses to create user without any required property -- response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/api/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`API refuses to create user when field type is wrong -- response code is 400`, async () => {
    const badUsers = [
      {...validUserData, name: true},
      {...validUserData, email: 1}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/api/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`API refuses to create user when field value is wrong -- response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/api/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`API refuses to create user when password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/api/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});
