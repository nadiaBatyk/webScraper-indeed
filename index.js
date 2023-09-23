import { readFile } from "fs/promises";
import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("query", {
    alias: ["q", "query"],
    describe: "The job title / job query to perform",
    type: "string",
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
console.log(argv);
(async () => {
  const query = argv.query?.split(" ").join("+");
  const days = argv.days;
  const sort = argv.sort;
  const regexKeyWords = argv.keywords;
  const url = `https://au.indeed.com/jobs?q=${query}&sort=${
    sort ? "date" : ""
  }&fromage=${days}`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector("div#mosaic-jobResults");
  // console.log(regexKeyWords);
  let listadoLinks = [];
  let visible = (await page.$('[data-testid="pagination-page-next"]')) !== null;
  let i = 0;
  while (visible && i < 3) {
    let nuevosLinks = await page.evaluate(() => {
      let links = [];
      let rawLinks = document.querySelectorAll(
        'a[class ="jcs-JobTitle css-jspxzf eu4oa1w0"]'
      );
      let location = document.querySelectorAll("div.companyLocation");
      let companyName = document.querySelectorAll(
        'div[class="heading6 company_location tapItem-gutter companyInfo"] span'
      );
      for (let i = 0; i < rawLinks.length; i++) {
        links.push({
          link: rawLinks[i].href,
          location: location[i]?.textContent ?? null,
          companyName: companyName[i]?.textContent ?? null,
        });
      }

      return links;
    });
    listadoLinks = [...listadoLinks, ...nuevosLinks];
    visible = (await page.$('[data-testid="pagination-page-next"]')) !== null;
    if (visible) {
      i++;
      await page.evaluate(() => {
        document.querySelector('[data-testid="pagination-page-next"]').click();
      });
      await page.waitForSelector("div#mosaic-jobResults");

      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  let listadoJobs = [];
  for (let i = 0; i < listadoLinks.length; i++) {
    await page.goto(listadoLinks[i].link);
    await new Promise((r) => setTimeout(r, 2000));

    let job = await page.evaluate(() => {
      let tmp = {};
      tmp.jobTitle =
        document.querySelector(
          "div.jobsearch-JobInfoHeader-title-container h1 span"
        )?.textContent ?? null;

      tmp.keyWords =
        document
          .querySelector("#jobDescriptionText")
          ?.innerText.match(regexKeyWords) ?? null;
      return tmp;
    });
    job.salary =
      (await page.$("#jobDetailsSection")) !== null
        ? await page.evaluate(() => {
            return document
              .querySelector("#jobDetailsSection")
              .innerText.match(/Salary\n(.)+\n/gi);
          })
        : null;
    job.link = listadoLinks[i].link;
    job.location = listadoLinks[i].location;
    job.companyName = listadoLinks[i].companyName;
    listadoJobs.push(job);
  }

  console.log(listadoJobs);
  console.log(listadoJobs.length);
  const informe = {
    fecha: new Date().toLocaleDateString(),
    busqueda: query,
    listado: listadoJobs,
    qtyAvisos: listadoJobs.length,
  };
  console.log(informe);
  await browser.close();

  //fs.writeFileSync("codigos.json", JSON.stringify(def));
})();
