'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../lib/logger`);
const {getRandomInt, shuffle} = require(`../../utils`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;
const TXT_FILES_DIR = `./data/`;

const logger = getLogger();

const OfferType = {
  offer: `offer`,
  buy: `buy`,
};

const SumRestrict = {
  min: 1000,
  max: 100000,
};

const PictureRestrict = {
  min: 1,
  max: 16,
};

const makeMockData = async (files) => {
  let mockData = {};
  try {
    for (const file of files) {
      const fileName = file.split(`.`)[0];
      const data = await readContent(fileName);
      mockData[fileName] = data;
    }
    return mockData;
  } catch (error) {
    logger.error(error);
    return mockData;
  }
};

const readContent = async (fileName) => {
  try {
    const content = await fs.readFile(`./data/${fileName}.txt`, `utf8`);
    const contentArray = content.split(`\n`);
    contentArray.pop();
    return contentArray;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const getPictureFileName = (number) => number > 10 ? `item${number}` : `item0${number}.jpg`;

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, mockData) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    description: shuffle(mockData.sentences).slice(0, getRandomInt(1, 5)).join(` `),
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    category: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), mockData.comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const files = await fs.readdir(TXT_FILES_DIR);

    const mockData = await makeMockData(files);
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, mockData), null, 2);

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  }
};
