#!/usr/bin/env node

import { program } from "commander";
import packageJson from "../package.json";

// CLI Information
program
  .name("htmx-cli")
  .description(
    "A simple, lightweight HTMX Scaffolding CLI for making laser horses 'n stuff.",
  )
  .version(packageJson.version);

program.parse(process.argv);
