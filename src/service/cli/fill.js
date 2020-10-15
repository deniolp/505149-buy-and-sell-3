'use strict';

const fs = require(`fs`).promises;
const {DateTimeFormat} = require(`intl`);

const {getLogger} = require(`../lib/logger`);
const {getRandomInt, shuffle, OfferType, SumRestrict, PictureRestrict, getPictureFileName, makeMockData, DateRestrict, TXT_FILES_DIR} = require(`../../utils`);

const logger = getLogger({
  name: `pino-from-service`,
});

const FILE_NAME = `fill-db.sql`;
const DEFAULT_COUNT = 5;

const createDate = () => {
  return new Date(getRandomInt(DateRestrict.min, DateRestrict.max));
};

const selectType = () => {
  return Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)];
};

const createCategories = (categories) => {
  let result = ``;
  let id = 1;
  for (const category of categories) {
    result = result + `(${id}, '${category}', 'picture.png'),\n`;
    id++;
  }
  return result.trim().slice(0, -1) + `;`;
};

const createOffers = (data, amount) => {
  let result = ``;
  for (let index = 1; index <= amount; index++) {
    result = result + `(${index}, '${selectType()}', '${data.titles[getRandomInt(0, data.titles.length - 1)]}', '${shuffle(data.sentences).slice(0, getRandomInt(1, 5)).join(` `)}', '${getRandomInt(SumRestrict.min, SumRestrict.max)}', '${getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max))}', '${`${new DateTimeFormat(`ru-RU`, {year: `numeric`, day: `numeric`, month: `numeric`}).format(new Date(createDate()))}`}', ${getRandomInt(1, 2)}),\n`;
  }
  return result.trim().slice(0, -1) + `;`;
};

const createComments = (comments, amount) => {
  let result = ``;
  let id = 1;
  for (const comment of comments) {
    result = result + `(${id}, '${comment}', '${`${new DateTimeFormat(`ru-RU`, {year: `numeric`, day: `numeric`, month: `numeric`}).format(new Date(createDate()))}`}', ${getRandomInt(1, 2)}, ${getRandomInt(1, amount)}),\n`;
    id++;
  }
  return result.trim().slice(0, -1) + `;`;
};

const createOffersAndCategoriesRelations = (amount, categoriesQty) => {
  let result = ``;
  let id = 1;
  let set;
  for (let i = 0; i < categoriesQty; i++) {
    const offersByCategoryQty = getRandomInt(1, amount);
    set = new Set();
    for (let k = 0; k < offersByCategoryQty; k++) {
      set.add(`(${getRandomInt(1, amount)}, ${id}),\n`);
    }
    result = result + [...set].join(``);
    id++;
  }
  return result.trim().slice(0, -1) + `;`;
};

const makeFillSql = (amount, mockData) => {
  return `INSERT INTO users VALUES
(1, 'Иван', 'Иванов', 'arteta@gmail.com', 'qwertyss', 'image.jpg'),
(2, 'Сергей', 'Сидоров', 'barguzin@gmail.com', 'qwertyss', 'image2.jpg');

INSERT INTO categories VALUES
${createCategories(mockData.categories)}

INSERT INTO offers VALUES
${createOffers(mockData, amount)}

INSERT INTO comments VALUES
${createComments(mockData.comments, amount)}

INSERT INTO offers_categories VALUES
${createOffersAndCategoriesRelations(amount, mockData.categories.length)}
`;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [qty] = args;
    const amount = Number.parseInt(qty, 10) || DEFAULT_COUNT;
    const files = await fs.readdir(TXT_FILES_DIR);
    const mockData = await makeMockData(files);
    const content = makeFillSql(amount, mockData);
    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  }
};
