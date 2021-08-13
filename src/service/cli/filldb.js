'use strict';

const fs = require(`fs`).promises;

const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const {getRandomInt, shuffle, OfferType, SumRestrict, PictureRestrict, getPictureFileName, makeMockData, readContent} = require(`../../utils`);

const {
  MAX_DATA_COUNT,
  TXT_FILES_DIR,
  ExitCode,
  DEFAULT_COUNT,
  MAX_COMMENTS
} = require(`../../constants`);

const logger = getLogger({
  name: `api-filldb`,
});

const getUsers = async () => {
  return [
    {
      name: `Иван Иванов`,
      email: `arteta@gmail.com`,
      passwordHash: await passwordUtils.hash(`ivanov`),
      avatar: `avatar01.jpg`,
    },
    {
      name: `Сергей Сидоров`,
      email: `barguzin@gmail.com`,
      passwordHash: await passwordUtils.hash(`sidorov`),
      avatar: `avatar02.jpg`,
    }
  ];
};

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

const generateOffers = (count, mockData, users) => (
  Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    description: shuffle(mockData.sentences).slice(0, getRandomInt(1, 5)).join(` `),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    categories: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), mockData.comments, users),
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);


    const [count] = args;
    if (count >= MAX_DATA_COUNT) {
      logger.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.error);
    }

    const countOffers = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const files = await fs.readdir(TXT_FILES_DIR);
    const mockData = await makeMockData(files);
    const categories = await readContent(`categories`);
    const users = await getUsers();
    const offers = generateOffers(countOffers, mockData, users);

    return initDatabase(sequelize, {offers, categories, users});
  }
};
