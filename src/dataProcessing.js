//include y exclude son 2 regex no arrays
export const processJobList = (jobList, include, exclude) => {
  for (const job of jobList) {
    if (
      job.title.match(exclude)?.length ||
      job.description.match(exclude)?.length > 3
    ) {
      continue;
    }
    //crear 1 sistema de score del trabajo???
    job.score = 0;
    job.score += job.title.match(include)?.length + 2;
    job.score += job.description.match(include)?.length + 1;
    job.score -= job.description.match(exclude)?.length;
    delete job.description;
  }
  return jobList;
};
