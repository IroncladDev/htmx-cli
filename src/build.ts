import path from "path";

export async function build() {
  await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "node",
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });

  // Temporary solution to fix bun build "import.meta.require" error
  const pathToBuildedFile = path.resolve("./dist/index.js");

  const inputFile = Bun.file(pathToBuildedFile);
  const outputFile = Bun.file(pathToBuildedFile);

  let inputFileText = await inputFile.text();

  if (!inputFileText.includes('import { createRequire } from "module";')) {
    inputFileText = inputFileText.replace(
      "var __require = (id) => {",
      'import { createRequire } from "module"; var __require = (id) => {',
    );
  }

  if (!inputFileText.includes("return createRequire(import.meta.url)(id);")) {
    inputFileText = inputFileText.replace(
      "return import.meta.require(id);",
      "return createRequire(import.meta.url)(id);",
    );
  }

  await Bun.write(outputFile, inputFileText);
}
