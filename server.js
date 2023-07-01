const express = require('express');
const serv = express();
const jsonParser = express.json();
const fs = require('fs');
const contentAvailable = require('./keywords.json').content;

const createHTML = function(textData) {
  let textArray = textData.split(`\n`);
  let resultHTML = `<!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${textArray[0]}</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: rgb(244, 217, 185);
        margin: 10px 50px 20px;
      }
      .content__header {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 40px;
        font-weight: 500;
        letter-spacing: 1px;
        text-shadow: 1px 1px 2px gray;
      }
      .content__text {
        font-size: 20px;
        line-height: 1.4;
        text-align: justify;
      }
    </style>
  </head>
  <body>
  <h1 class="content__header">${textArray[0]}</h1>`;
  for (let i = 1; i < textArray.length; i++) {
    resultHTML += `<p class="content__text">${textArray[i]}</p>`;
  }
  resultHTML += `</body></html>`
  return resultHTML;
}

serv.post('/search', jsonParser, (request, response) => {
  if (!request.body) return response.sendStatus(400);
  let result = {urlsAvailable: []};
  let keywordListed = contentAvailable.find(e => e.keyword.toLowerCase() == request.body.keyword.toLowerCase())
  if (keywordListed) {
    result = {urlsAvailable: keywordListed.urls}
  }
  response.json(result)
})

serv.post('/download', jsonParser, (request, response) => {
  if(!request.body) return response.sendStatus(400);
  let fileContent_ = fs.readFileSync(`./content/${request.body.requiredContent.toLowerCase()}.txt`, 'utf8')

  fs.readFile(`./content/${request.body.requiredContent.toLowerCase()}.txt`, 'utf8', ((err, data) =>  {
    if (err) {
      throw err;
    } else {
      let result = {requiredContent: request.body.requiredContent, textContent: createHTML(data)}
      response.json(result)
    }
  }))
  // let result = {requiredContent: request.body.requiredContent, textContent: createHTML(fileContent)};
  // response.json(result)
})

serv.get('/', (request, response) => {
  response.sendFile(`${__dirname}/public/index.html`)
});

serv.listen(1412);