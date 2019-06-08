const express = require ('express');
const request = require ('request');
const cheerio = require ('cheerio');
const fs      = require ('fs');
var app       = express();

app.use(express.static('public'))


app.get('/json', function(req, res){

  const url = 'https://www.cnet.com/news/';

  request(url, (error,response,html) => {
    if(!error && response.statusCode ==200) {
      const $ = cheerio.load(html);
      var json = {  }; //new object  json
      json.articles = [] ; //new array  articles

      //for each <a class = assetHed></a> , add the text of this node to the JSON
      $('a.assetHed').each((i,el) => {
        var title = {}; //create new Object called titles
        var hyperLink = {};//create new Object called links
        var item = $(el).text().trim(); //text of element and then trim trailing white spaces
        var link = $(el).attr('href'); // link of element attribute 'href'

        title.name = item; // {"name": item}
        title.linkName = link; // {"linkName": link}
        json.articles.push(title); //push the title to the articles array
      })
    }

    else {
      console.log('error happened :' + error);
    }

    res.json(json); //sends a JSON response; converted to a JSON string using JSON.stringify().
  });
})

app.listen(8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;
