import { join } from "path";
import {
  Packager,
  readmeContent,
  successfulInstallMessage,
} from "../../lib/constants";
import { overwriteFromDir } from "../../lib/utils";
import { initializeTailwind } from "./tailwind";
import fs from "fs";

/**
 * Initializes a static project
 */
export default async function createStaticProject({
  path,
  tailwind,
  hyperscript,
  packager,
}: {
  path: string;
  tailwind: boolean;
  hyperscript: boolean;
  packager: Packager | undefined;
}) {
  if (hyperscript && tailwind) {
    await overwriteFromDir("./files/html/hyperscript-tailwind", path);
  } else if (hyperscript) {
    await overwriteFromDir("./files/html/hyperscript", path);
  } else if (tailwind) {
    await overwriteFromDir("./files/html/tailwind", path);
  } else {
    await overwriteFromDir("./files/html/plain", path);
  }

  if (tailwind && packager)
    await initializeTailwind({ packager, path, isStatic: true });

  fs.writeFileSync(
    join(process.cwd(), path, "README.md"),
    readmeContent({ packager, hyperscript, tailwind, isStatic: true }),
  );

  console.log(
    successfulInstallMessage({ path, tailwind, packager, isStatic: true }),
  );
}
