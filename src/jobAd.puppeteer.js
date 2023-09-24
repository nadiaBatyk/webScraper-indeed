export const getJobsData = async (page, jobsLinks) => {
  let listadoJobs = [];
  for (let i = 0; i < jobsLinks.length; i++) {
    await page.goto(jobsLinks[i].link);
    await new Promise((r) => setTimeout(r, 2000));

    let job = await page.evaluate(() => {
      let tmp = {};
      tmp.jobTitle =
        document.querySelector(
          "div.jobsearch-JobInfoHeader-title-container h1 span"
        )?.textContent ?? null;

      tmp.jobDescription = document.querySelector(
        "#jobDescriptionText"
      )?.innerText;
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
