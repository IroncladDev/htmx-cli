#!/usr/bin/env node

import { program } from "commander";

// CLI Information
program
  .name("htmx-cli")
  .description(
    "A simple, lightweight HTMX Scaffolding CLI for making laser horses 'n stuff.",
  )
  .version("0.0.1");

program.parse(process.argv);
