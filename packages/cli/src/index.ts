#!/usr/bin/env node

import yargs from "yargs";
import { VerifyCommand } from "./commands/verify";

yargs
  //.usage("Usage: $0 <command> [options]")
  .command(new VerifyCommand())
  .demandCommand(1)
  .strict()
  .alias("v", "verify")
  .help("h")
  .alias("h", "help").argv;
