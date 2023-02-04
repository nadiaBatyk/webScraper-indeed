import { readFile } from "fs/promises";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const query = process.env.QUERY?.split(" ").join("+") || "software+engineer";
  const days = process.env.DAYS || "14";
  const filtrarDias = process.env.FILTRARDIAS || false;
  const keywords = [];
  const regexKeyWords = new RegExp(keywords.join("|"), "gi");
  const url = `https://au.indeed.com/jobs?q=${query}&sort=date ${
    filtrarDias && `&fromage=${days}`
  }`;

  await page.goto(url);

  await page.waitForSelector("div.jobsearch-SerpMainContent");

  let listadoLinks = [];
  let visible = (await page.$('[data-testid="pagination-page-next"]')) !== null;
  let i = 0;
  while (visible && i < 10) {
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
      await page.click('[data-testid="pagination-page-next"]');
      await page.waitForSelector("div.jobsearch-SerpMainContent");

      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  let listadoJobs = [];
  for (let i = 0; i < listadoLinks.length; i++) {
    await page.goto(listadoLinks[i].link);
    await new Promise((r) => setTimeout(r, 500));

    let job = await page.evaluate(() => {
      let tmp = {};
      tmp.jobTitle =
        document.querySelector(
          "div.jobsearch-JobInfoHeader-title-container h1 span"
        )?.textContent ?? null;

      tmp.keyWords =
        document
          .querySelector("#jobDescriptionText")
          ?.innerText.match(
            /(node|react|typescript|javascript|angular|next|express|nest|fullstack|backend|\.net|java|python|django|c#|spring|senior|mid|junior)/gi
          ) ?? null;
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

  //fs.writeFileSync('codigos.json', JSON.stringify(def));
})();
