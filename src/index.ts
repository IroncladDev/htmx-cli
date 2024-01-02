#!/usr/bin/env node

import { program } from "commander";
import packageJson from "../package.json";
import InitCommand from "./commands/init";
import { packager, packagers } from "./lib/constants";
import { exitWithMessage } from "./lib/utils";

// CLI Information
program
  .name("htmx-cli")
  .description(
    "A simple, lightweight HTMX Scaffolding CLI for making laser horses 'n stuff.",
  )
  .version(packageJson.version);

// Initialization Command
program
  .command("init")
  .description("Initialize a new HTMX project")
  .argument("[path]", "The path to initialize the project in")
  .option("--tailwind", "Use Tailwind CSS")
  .option("--hyperscript", "Use Hyperscript")
  .option(
    "--packager <packager>",
    "Use a specific packager",
    (value: string) => {
      const res = packager.safeParse(value);

      if (res.success) return res.data;

      exitWithMessage(
        `Invalid packager specified. Must be one of [${packagers.join(", ")}]`,
      );
    },
  )
  .action(InitCommand);

program.parse(process.argv);
