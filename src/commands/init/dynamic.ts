import { join } from "path";
import {
  execute,
  exitWithMessage,
  overwriteFromDir,
  packagerExists,
} from "../../lib/utils";
import { withLoadingLaserhorse } from "../../lib/loading";
import {
  Framework,
  Packager,
  readmeContent,
  successfulInstallMessage,
} from "../../lib/constants";
import chalk from "chalk";
import fs from "fs";
import { initializeTailwind } from "./tailwind";

/**
 * Initializes a project with a server
 */
export default async function createDynamicProject({
  path,
  tailwind,
  hyperscript,
  packager,
  framework,
}: {
  path: string;
  tailwind: boolean;
  hyperscript: boolean;
  packager: Packager;
  framework: Framework;
}) {
  await installFramework({ framework, path, packager });

  const staticDir = join(path, "public");

  if (hyperscript && tailwind) {
    await overwriteFromDir("./files/html/hyperscript-tailwind", staticDir);
  } else if (hyperscript) {
    await overwriteFromDir("./files/html/hyperscript", staticDir);
  } else if (tailwind) {
    await overwriteFromDir("./files/html/tailwind", staticDir);
  } else {
    await overwriteFromDir("./files/html/plain", staticDir);
  }

  if (tailwind) await initializeTailwind({ packager, path, isStatic: false });

  fs.writeFileSync(
    join(process.cwd(), path, "README.md"),
    readmeContent({
      framework,
      packager,
      hyperscript,
      tailwind,
      isStatic: false,
    }),
  );

  console.log(
    successfulInstallMessage({ path, tailwind, packager, isStatic: false }),
  );
}

/**
 * Installs a framework into the project directory
 */
async function installFramework({
  framework,
  path,
  packager,
}: {
  framework: Framework;
  path: string;
  packager: Packager;
}) {
  switch (framework) {
    case "elysia":
      if (packager !== "bun")
        return exitWithMessage("Elysia requires the Bun packager");
      if (!(await packagerExists("bun")))
        return exitWithMessage("Bun is not installed");

      await withLoadingLaserhorse(
        execute("bun create elysia " + path, { cwd: process.cwd() }),
        "Installing Elysia...",
      );

      await withLoadingLaserhorse(
        execute("bun install @elysiajs/static", {
          cwd: join(process.cwd(), path),
        }),
        "Installing Dependencies...",
      );

      process.stdout.write(
        chalk.green("\rSuccessfully installed Elysia ✔︎") +
          " ".repeat(10) +
          "\n",
      );

      await overwriteFromDir("./files/framework/elysia", path);
      await overwriteFromDir("./files/public", join(path, "public"));
      break;
    case "express":
      const installPrefix = `${packager} ${
        packager === "yarn" ? "add" : "install"
      }`;

      fs.mkdirSync(path);

      await withLoadingLaserhorse(
        execute(`npm init -y && ${installPrefix} express`, {
          cwd: join(process.cwd(), path),
        }),
        "Installing Express...",
      );

      process.stdout.write(
        chalk.green("\rSuccessfully installed Express ✔︎") +
          " ".repeat(10) +
          "\n",
      );

      const packageJsonPath = join(process.cwd(), path, "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      if (packageJson.scripts && typeof packageJson.scripts === "object") {
        packageJson.scripts.dev = "node index.js";
      } else {
        packageJson.scripts = {
          dev: "node index.js",
        };
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      await overwriteFromDir("./files/framework/express", path);
      await overwriteFromDir("./files/public", join(path, "public"));
      break;
    default:
      exitWithMessage("Framework " + framework + " not supported");
  }
}
