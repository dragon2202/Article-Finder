const express = require ('express');
const request_promise = require ('request-promise');
const cheerio = require ('cheerio');

var app = express();

app.use(express.static('public'));

app.get('/json', function(req, res){

  websites = [];

  cnet = {
    domain : 'https://www.cnet.com',
    uri: 'https://www.cnet.com/news',
    article_class: 'a.assetHed',
    text_class: '.speakableTextP1',
    date_class: '.formattedDate',
    time_class: '.formattedTime'
  }

  foxpolitics = {
    domain : 'https://www.foxnews.com/',
    uri: 'https://www.foxnews.com/politics',
    article_class: '.title > a',
    text_class: '.speakable',
    date_class: '.article-date',
    time_class: ''
  }

  websites.push(cnet);
  websites.push(foxpolitics);

  var domain_promises = [];

  var json = {}; //new object  json
  json.articles = [];

  websites.forEach(function (element) {

    /*
    first options for request_promise;
    transform is similar to creating a new Promise;
    */
    const options = {
      uri: element.uri,
      transform: function (body) {
        let $ = cheerio.load(body);
        /*
        for each element.article_class css selector , add the text and href of this node to the JSON
        */
        var article_array =  $(element.article_class).map(function (i, el ) {
          let data = {}; //create new Object called data
          data.info = element;
          data.title = $(el).text().trim(); //text of element and then trim trailing white spaces
          let href = $(el).attr('href'); // link of element attribute 'href'
          data.link = element.domain.concat(href);
          return data;
        }).get();
        return article_array;
      }
    };

    /*
    passed first options. after cheeio successfully loaded the html (transform);
     created js object (json) to put all data ;
     created array for promise because doing multiple promises
     to webscrape first paragraph of the actual article
     this will create promise for each
    */
    domain_promises.push(request_promise(options));
  });


  /*
  waiting for all promises to finish;
  will return an array of results, so loop through each result;
  push each of the results [ data.text (from options2) ] into json;
  then send the json to the response object
  */
  Promise.all(domain_promises)
  .then(function (results) {
    var new_array = [];
    for (var index = 0 ; index < results.length ; index ++){
      new_array = new_array.concat(results[index]);
    }
    return new_array;
  })
  .then(function (results){
    var promises = [];
    results.forEach(function (element){

      /*
      second options for request_promise -
        cheerio will load data.link ;
        select the text from <p class = '.speakableTextP1' ></p>;
        put that text in data.text in json
      */
      const options2 = {
        uri: element.link,
        transform: function (body) {
          const $ =  cheerio.load(body);
          element.text = $(element.info.text_class).text().trim();
          element.date = $(element.info.date_class).text().trim() + ' ' + $(element.info.time_class).text().trim();
          //console.log(element);
          return element;
        }
      };
      /*
       this will create promise for each
      */
      promises.push(request_promise(options2));
    })
    return Promise.all(promises);
  })
  .then (function(results){
    //console.log("results");
    //console.log(results);
    for (var i = 0 ; i < results.length ; i ++){
      json.articles.push(results[i]);
    }
    //console.log(json);
    return json;
  })
  .then (function(results){
    console.log(results);
    res.json(results);
  })
  .catch(function (error) {
    console.log(error);
  });
});

app.listen(8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;
