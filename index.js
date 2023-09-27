import { readFile } from "fs/promises";
import { argv } from "./src/yargs.config.js";
import { getJobsLinks } from "./src/jobsList.puppeteer.js";
import { getJobsData } from "./src/jobAd.puppeteer.js";
import puppeteer from "puppeteer";
import { processJobList } from "./src/dataProcessing.js";

(async () => {
  const { query, days, sort, include, exclude } = argv;
  console.log(argv);
  const url = `https://au.indeed.com/jobs?q=${query.join("+")}${
    sort ? "&sort=date" : ""
  }&fromage=${days}`;
  const seekUrl = `https://www.seek.com.au/${query.join(
    "-"
  )}-jobs?daterange=${days}${sort ? "&sortmode=ListedDate" : ""}`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  //tengo q tener n listados de laburos x pagina q visito
  //ahora tengo 1 xq solo voy a indeed
  let listadoLinks = await getJobsLinks(page, url);
  let listadoJobs = await getJobsData(page, listadoLinks);

  let finalJobList = processJobList(listadoJobs, include, exclude);
  const informe = {
    fecha: new Date().toLocaleDateString(),
    busqueda: query,
    qtyAvisos: finalJobList.length,
    listado: finalJobList,
  };
  console.log(informe);
  await browser.close();

  //fs.writeFileSync("codigos.json", JSON.stringify(def));
})();
