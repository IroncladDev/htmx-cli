import inquirer from "inquirer";
import createStaticProject from "./static";
import createDynamicProject from "./dynamic";
import fs from "fs";
import { join } from "path";
import { Packager, frameworks, packagers } from "../../lib/constants";
import { exitWithMessage, packagerExists } from "../../lib/utils";

export default async function InitCommand(
  dir: string,
  options: {
    tailwind: boolean;
    hyperscript: boolean;
    packager: Packager;
  },
) {
  try {
    const { path, htmx } = await inquirer.prompt([
      {
        type: "input",
        name: "path",
        message: "What is the name of your project?",
        default: "my-app",
        when: !dir,
      },
      {
        type: "confirm",
        name: "htmx",
        message: "Would you like to use HTMX?",
        default: true,
      },
    ]);

    if (!htmx) {
      exitWithMessage("It's so over");
    }

    if (fs.existsSync(join(process.cwd(), path))) {
      exitWithMessage(`Directory ${path} already exists`);
    }

    const { hyperscript, tailwind } = await inquirer.prompt([
      {
        type: "confirm",
        name: "tailwind",
        message: "Would you like to use Tailwind?",
        default: true,
        when: !options.tailwind,
      },
      {
        type: "confirm",
        name: "hyperscript",
        message: "Would you like to use Hyperscript?",
        default: true,
        when: !options.hyperscript,
      },
    ]);

    const { backend } = await inquirer.prompt([
      {
        type: "confirm",
        name: "backend",
        message:
          "Would you like a backend server from which to serve Hypermedia?",
        default: true,
      },
    ]);

    const { packager } = await inquirer.prompt([
      {
        type: "list",
        name: "packager",
        message: "Which package manager would you like to use?",
        choices: packagers,
        default: "bun",
        when: [
          !options.packager,
          !backend && !options.tailwind && !tailwind,
        ].some((x) => !x),
      },
    ]);

    if (packager && !(await packagerExists(packager as Packager))) {
      exitWithMessage(`Packager ${packager} not installed on your system`);
    }

    if (backend) {
      const { framework } = await inquirer.prompt({
        type: "list",
        name: "framework",
        message:
          "Which backend framework would you like to use? (elysia is the only option available now)",
        choices:
          packager === "bun"
            ? frameworks
            : frameworks.filter((x) => x !== "elysia"),
      });

      return await createDynamicProject({
        path: dir || path,
        tailwind: options.tailwind || tailwind,
        hyperscript: options.hyperscript || hyperscript,
        packager: options.packager || packager,
        framework,
      });
    }

    return await createStaticProject({
      path,
      tailwind,
      hyperscript,
      packager,
    });
  } catch (err) {
    exitWithMessage(`Failed with error: "${(err as Error).message}"`);
  }
}
