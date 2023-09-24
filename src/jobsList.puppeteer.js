export const getJobsLinks = async (page, url) => {
  await page.goto(url);

  await page.waitForSelector("div#mosaic-jobResults");

  let listadoLinks = [];
  let visible = (await page.$('[data-testid="pagination-page-next"]')) !== null;
  let i = 0;
  while (visible && i < 2) {
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
  return listadoLinks;
};
