const chalk = require("chalk");

module.exports = {
  name: "connecting",
  execute() {
    console.log(chalk.green("[MongoDB] Criando conexão com o MongoDB."));
  },
};
