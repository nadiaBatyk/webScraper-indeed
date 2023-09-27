//include y exclude son 2 regex no arrays
export const processJobList = (jobList, include, exclude) => {
  let refinedList = [];
  for (const job of jobList) {
    if (
      job.title.match(exclude)?.length ||
      job.description.match(exclude)?.length > 3
    ) {
      continue;
    }
    //crear 1 sistema de score del trabajo???
    job.score = 0;
    job.score += 2 + job.title.match(include)?.length || 0;
    job.score += 1 + job.description.match(include)?.length || 0;
    job.score -= job.description.match(exclude)?.length || 0;
    delete job.description;
    refinedList.push(job);
  }
  return refinedList.sort((a, b) => a.score - b.score);
};
