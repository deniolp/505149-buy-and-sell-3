'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);
const fillsql = require(`./fillsql`);
const filldb = require(`./filldb`);

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fillsql.name]: fillsql,
  [filldb.name]: filldb,
};

module.exports = {
  Cli,
};
