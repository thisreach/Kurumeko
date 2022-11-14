const chalk = require("chalk");

module.exports = {
  name: "err",
  execute(err) {
    console.log(chalk.red(`[MongoDB] Ocorreu um erro:\n${err}`));
  },
};
