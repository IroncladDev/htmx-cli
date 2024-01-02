import { build } from "./build";
import chalk from "chalk";
import chokidar from "chokidar";
import { glob } from "glob";

console.log("Compiling...");

await build();

let srcFiles = await glob("src/**/*");
let lastChange: string | null = null;
let changeCount = 0;

console.log(chalk.magenta("👀 watching src folder for changes"));

chokidar
  .watch("src")
  .on("add", (path) => {
    if (srcFiles.includes(path)) return;

    console.log((changeCount ? "\n" : "") + chalk.green("+ " + path));
    changeCount = 0;
    build();
  })
  .on("change", (path) => {
    if (lastChange === path) {
      process.stdout.write(
        chalk.yellow(
          `\r~ ${path} ${++changeCount > 1 ? `(x${changeCount})` : ""}`,
        ),
      );
    } else {
      process.stdout.write(
        chalk.yellow((changeCount > 1 ? "\n" : "") + "~ " + path),
      );
      changeCount = 1;
    }
    lastChange = path;
    build();
  })
  .on("unlink", (path) => {
    console.log((changeCount ? "\n" : "") + chalk.red("- " + path));
    changeCount = 0;
    srcFiles = srcFiles.filter((p) => p !== path);
    build();
  })
  .on("error", (error) => {
    console.error(
      (changeCount ? "\n" : "") +
        chalk.red("\n🚨 ERROR: " + error.message + "\n"),
    );
    changeCount = 0;
  });

process.on("SIGINT", () => {
  process.exit(0);
});
