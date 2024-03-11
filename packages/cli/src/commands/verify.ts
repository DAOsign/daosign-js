import yargs from "yargs";
import path from "path";
import chalk from "chalk";
import fs from "fs";
import { verifyCertificateBytes } from "@daosign/verification";

export class VerifyCommand implements yargs.CommandModule {
  command = "verify [path]";
  describe = "Verifies file at location";
  builder(args: yargs.Argv) {
    return args.positional("path", {
      type: "string",
      describe: "Path of the file to verify",
      demandOption: true,
    });
  }
  async handler(args: yargs.Arguments) {
    const fullPath = (args.path as string).startsWith("/")
      ? (args.path as string)
      : path.resolve(process.cwd(), args.path as string);

    const filename = path.basename(fullPath);
    try {
      const file = fs.readFileSync(fullPath);

      verifyCertificateBytes(file).then(() => {
        console.log(chalk.green(`File ${chalk.blue(filename)} is valid.`));
      });
    } catch (e) {
      console.log(
        chalk.red(
          `File ${chalk.blue(filename)} was not found at ${chalk.blue(
            fullPath
          )}`
        )
      );
    }
    return;
  }
}
