# Web Scraper Indeed.com.au

An easy and time effective CLI tool to look for a job on Indeed.com.au

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Project Overview

This project was born when I started looking for a new job as a junior backend / full stack developer and the results provided by Indeed.com.au weren’t what I was looking for. Job alerts that send you senior roles or vague job titles with a description expecting +5 years of experience. So I decided to code my own web scraper to automate my job search using the terminal, passing parameters to refine my search and filter my final job list with include and exclude keywords. The final result is an array of suitable jobs sorted by a score that I calculated using the keywords provided. This data can be saved on a json file or just check it on the terminal. I’m currently working in replicating the same project but for seek.com.au as well.

## Features

- Easy job search using the CLI passing just 3 minimun arguments: query, include and exclude keywords
- You can also pass the days and sort by date parameters to refine the search
- This will automatically scrap all Indeed.com.au results until the last page
- Each job will have a score calculated on the quantity of keywords that matched the job title and / or the job description.
- Finally the results will be processed into 1 array of jobs containing the relevant info of each ad, sorted by the score.

## Installation

```bash
# Example installation steps
git clone https://github.com/nadiaBatyk/webScraper-indeed.git
cd webScraper-indeed
npm install
```
## Usage

To run the project you need to use => node index.js + the minimun commands of -query, -include and -exclude

### Available commands
#### Required
- -query or -q => the job title that you want to search for. It has a string format => -q "software engineer"
- -include or -i => the keywords that must be in the job title or description. It has an array format => -i node backend junior.
- -exclude or -e => the keywords that shouldn't be in the job title or description. It has an array format => -e php .net senior principal
  
#### Optional
- -sort or -s => if you include this flag the results will be sorted by date
- -days or -d => the time frame to do the job search, the default value is the last 14 days

### Score system

Example use case = node index.js -q "software engineer" -i junior backend developer -e senior .net java php

#### Include Keywords: 
If a keyword is included in the title adds +2 points to the job score, if a keyword is included in the description adds +1 point to the job score.

Examples:
- job title: "Junior Software Engineer" => "junior" belongs to the include keywords so this ad has +2 points on the score
  
  score = 2
- job description : " This is a backend focused role..." => "backend" also belongs to the include keywords, but this only adds +1 point because its on the job description
  
  score = 3
  
#### Exclude Keywords: 
If one of these keywords is included in the job title or is repeated more than 3 times in the job description, the job is deleted from the final list. 
If one of these keywords is on the job description (less than 3 times), it substracts 1 point each time its included.
Examples:
- job title: "Senior Full Stack Engineer" => "senior" belongs to the exclude keywords so this ad gets removed from the list
- job description : " The tech stack for this role is: Java" => "java" also belongs to the exclude keywords, but this only substracts -1 point because its on the job description
  
  score = -1
- job description : " This position is for a Senior backend engineer that is proeficient with .NET, php and Java" => in this case, this job ad also gets deleted from the final list because it has +3 exclude     
  keywors on the description

### Data format
The result of the search will be an array of jobs with the following format:
- Title
- URL
- Company name (if available)
- Salary (if available)
- Location (if available)
  
