import chalk from "chalk";

export const logger = {
  info: (message: string) => console.log(chalk.blue("ℹ"), chalk.blue(message)),
  success: (message: string) => console.log(chalk.green("✓"), chalk.green(message)),
  error: (message: string) => console.log(chalk.red("✗"), chalk.red(message)),
  warn: (message: string) => console.log(chalk.yellow("⚠"), chalk.yellow(message)),
  log: (message: string) => console.log(message),
};
