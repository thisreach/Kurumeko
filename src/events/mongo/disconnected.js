const chalk = require("chalk");

module.exports = {
  name: "disconnected",
  execute() {
    console.log(chalk.green("[MongoDB] Desconectado com sucesso."));
  },
};
