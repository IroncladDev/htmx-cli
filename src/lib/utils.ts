import { promisify } from "util";
import { exec as execOriginal } from "child_process";
import { Packager } from "./constants";
import { promises as fs } from "fs";
import { join, dirname } from "path";
import { glob } from "glob";
import chalk from "chalk";
import { fileURLToPath } from "url";

/**
 * Promisified version of `child_process.exec`.
 */
export const execute = promisify(execOriginal);

export function exitWithMessage(message: string) {
  console.log(chalk.red(message));
  process.exit(1);
}

/**
 * Checks if a packager exists on the system.
 * @param {Packager} packager - The packager to check for.
 */
export async function packagerExists(packager: Packager) {
  try {
    const isWin = process.platform === "win32";

    if (isWin) {
      const { stdout } = await execute("where " + packager);

      return typeof stdout === "string" && stdout.length > 0;
    } else {
      const { stdout } = await execute("command -v " + packager);

      return typeof stdout === "string" && stdout.length > 0;
    }
  } catch (e) {
    return false;
  }
}

/**
 * Overwrites the contents of a target directory with the contents of a template directory.
 * Existing files in the target directory not present in the template directory will be left untouched.
 * @param {string} templatePath - The path to the template directory relative to `import.meta.url`.
 * @param {string} targetPath - The path to the target directory relative to the current working directory.
 */
export async function overwriteFromDir(
  templatePath: string,
  targetPath: string,
): Promise<void> {
  try {
    const baseTemplatePath = fileURLToPath(import.meta.resolve(templatePath));

    const files = await glob("**/*", {
      cwd: baseTemplatePath,
      nodir: true,
    });

    for (const file of files) {
      const templateFile = join(baseTemplatePath, file);
      const targetFile = join(process.cwd(), targetPath, file);

      await fs.mkdir(dirname(targetFile), { recursive: true });
      await fs.copyFile(templateFile, targetFile);
    }
  } catch (err) {
    console.error("Failed to overwrite directory:", err);
  }
}
