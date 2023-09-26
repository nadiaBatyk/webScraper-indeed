export const getJobsData = async (page, jobsLinks) => {
  let listadoJobs = [];
  for (let i = 0; i < jobsLinks.length; i++) {
    try {
      await page.goto(jobsLinks[i].link);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      continue;
    }

    let job = await page.evaluate(() => {
      let tmp = {};
      tmp.title = document.querySelector(
        "div.jobsearch-JobInfoHeader-title-container h1 span"
      )?.textContent;

      tmp.description = document
        .querySelector("#jobDescriptionText")
        ?.innerText.trim();
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
    job.link = jobsLinks[i].link;
    job.location = jobsLinks[i].location;
    job.companyName = jobsLinks[i].companyName;
    listadoJobs.push(job);
  }
  return listadoJobs;
};
