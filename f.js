console.log("Job details\nNo matching job preferences\nSalary\n$30 - $32 an hour\nJob Type\nFull-time\nShift and Schedule\nOvertime".match(/Salary\n(.)+\n/gi))
const keywords = ['node','react','typescript','javascript','remote','wfh','angular','next','express','nest'];
const regexKeyWords = new RegExp(`(${keywords.join("|")})`, "gi");
console.log(regexKeyWords);