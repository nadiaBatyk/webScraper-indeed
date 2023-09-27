import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const argv = yargs(hideBin(process.argv))
  .option("query", {
    alias: ["q", "query"],
    describe: "The job title / job query to perform",
    type: "string",
    coerce: (k) => k.split(" "),
  })
  .option("days", {
    alias: ["d", "days"],
    describe: "Days to perform the search",
    default: 14,
    type: "number",
  })
  .option("sort", {
    alias: ["s", "sort"],
    describe: "Sort the search result by date",
    default: true,
    type: "boolean",
  })
  .option("include", {
    alias: ["i", "include"],
    describe: "Only show ads including these keywords",
    type: "array",
    coerce: (k) => new RegExp(k.join("|"), "gi"),
  })
  .option("exclude", {
    alias: ["e", "exclude"],
    describe: "Keywords to filter and exclude the results",
    type: "array",
    coerce: (k) => new RegExp(k.join("|"), "gi"),
  })
  .demandOption(
    ["query", "include", "exclude"],
    "Please specify the query and at least 1 include and exclude keyword"
  )
  .help()
  .parse();
