import { watch } from "fs";
import { build } from "./build";
import chalk from "chalk";

console.log(chalk.magenta("👀 watching src folder for changes"));

const srcWatcher = watch(`src`, { recursive: true }, () => build());

process.on("SIGINT", () => {
  srcWatcher.close();
  process.exit(0);
});
