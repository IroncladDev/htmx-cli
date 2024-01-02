import chalk from "chalk";
import { Packager } from "../../lib/constants";
import { withLoadingLaserhorse } from "../../lib/loading";
import { execute, exitWithMessage, overwriteFromDir } from "../../lib/utils";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";

/**
 * Initializes Tailwind CSS in the project directory
 */
export async function initializeTailwind({
  packager,
  path,
  isStatic,
}: {
  packager: Packager;
  path: string;
  isStatic: boolean;
}) {
  // prettier-ignore
  const installCommand =
    packager === "npm"
      ? "npm i tailwindcss postcss autoprefixer -D && npx tailwindcss init"
      : packager === "bun"
      ? "bun i tailwindcss postcss autoprefixer -D && bunx tailwindcss init"
      : packager === "yarn"
      ? "yarn add tailwindcss postcss autoprefixer -D && yarn tailwindcss init"
      : "pnpm add tailwindcss postcss autoprefixer -D && pnpm tailwindcss init";

  if (isStatic) {
    await execute("npm init -y", { cwd: join(process.cwd(), path) });
  }

  await withLoadingLaserhorse(
    execute(installCommand, {
      cwd: join(process.cwd(), path),
    }),
    "Installing Tailwind...",
  );

  await transformFiles({ path, isStatic });

  process.stdout.write(
    chalk.green("\rSuccessfully installed Tailwind ✔︎\n" + " ".repeat(10)),
  );
}

/**
 * Transforms the files in the project directory to make working with Tailwind easier
 */
async function transformFiles({
  path,
  isStatic,
}: {
  path: string;
  isStatic: boolean;
}) {
  try {
    await overwriteFromDir(
      "./files/tailwind/" + (isStatic ? "static" : "dynamic"),
      path,
    );

    // Add tailwind build/watch scripts to package.json
    const packageJsonPath = join(process.cwd(), path, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const twBuildScript = `tailwindcss -i ./${
      isStatic ? "" : "public/"
    }style.css -o ./${isStatic ? "" : "public/"}dist/style.css`;

    if (packageJson.scripts && typeof packageJson.scripts === "object") {
      packageJson.scripts.watch = twBuildScript + " --watch";
      packageJson.scripts.build = twBuildScript;

      const devScript = packageJson.scripts.dev;

      // Runs the tailwind watch script in parallel with the dev script
      if (devScript && typeof devScript === "string") {
        packageJson.scripts.dev = devScript + " & npm run watch";
      }
    } else {
      packageJson.scripts = {
        watch: twBuildScript + " --watch",
        build: twBuildScript,
      };
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (e) {
    exitWithMessage(
      "Failed to initialize tailwind with error: " + (e as Error).message,
    );
  }
}
