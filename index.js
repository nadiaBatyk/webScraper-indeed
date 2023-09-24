import { readFile } from "fs/promises";
import { argv } from "./src/yargs.config.js";
import { getJobsLinks } from "./src/jobsList.puppeteer.js";
import { getJobsData } from "./src/jobAd.puppeteer.js";
import puppeteer from "puppeteer";

(async () => {
  const { query, days, sort, keywords } = argv;
  console.log(argv);
  const url = `https://au.indeed.com/jobs?q=${query}${
    sort ? "&sort=date" : ""
  }&fromage=${days}`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let listadoLinks = await getJobsLinks(page, url);
  let listadoJobs = await getJobsData(page, listadoLinks);

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
