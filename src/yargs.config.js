import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const argv = yargs(hideBin(process.argv))
  .option("query", {
    alias: ["q", "query"],
    describe: "The job title / job query to perform",
    type: "string",
    coerce: (k) => k.split(" ").join("+"),
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
    type: "boolean",
  })
  .option("keywords", {
    alias: ["k", "keywords"],
    describe: "Keywords to filter the results",
    type: "array",
    coerce: (k) => new RegExp(k.join("|"), "gi"),
  })
  .demandOption(
    ["query", "keywords"],
    "Please specify the query and at least 1 keyword"
  )
  .help()
  .parse();
