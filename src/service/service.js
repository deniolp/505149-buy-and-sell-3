'use strict';

const chalk = require(`chalk`);
const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  MAX_DATA_COUNT,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

switch (userCommand) {
  case `--generate`:
    const count = userArguments.slice(1);
    if (count >= MAX_DATA_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.error);
    }
    Cli[userCommand].run(count);
    break;

  case `--server`:
    const port = userArguments.slice(1);
    Cli[userCommand].run(port);
    break;

  default:
    Cli[userCommand].run();
    break;
}
