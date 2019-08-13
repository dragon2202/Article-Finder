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


    websites.forEach(function (element) {
      //console.log(element.uri);

      const options = {
        uri: element.uri,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

    //  domain_promises.push(request_promise(options));



    //  Promise.all(domain_promises)
    request_promise(options)
      .then(function ($) {

        var promises = []; //creating a new array of promises
        json.articles = [] ; //new array  articles

        $(element.article_class).each((i,el) => {
          //console.log("i am in element, picking out the article class");
          let data = {}; //create new Object called data
          data.title = $(el).text().trim(); //text of element and then trim trailing white spaces
          let href = $(el).attr('href'); // link of element attribute 'href'
          data.link = element.domain.concat(href);
          //console.log(data);

          const options2 = {
            uri: data.link,
            transform: function (body) {
              const $ =  cheerio.load(body);
              data.text = $('.speakableTextP1').text().trim();
              data.date =  $('.formattedDate').text().trim() + ' ' + $('.formattedTime').text().trim();
              return data;
            }
          };

          promises.push(request_promise(options2));
        });
        Promise.all(promises)
        .then((results) => {
          //console.log("i am in promise all")
          for (var i = 0 ; i < results.length ; i ++){
            json.articles.push(results[i]);
          }
          return json;
        })
        .then((results) => {
          console.log(results); // <-- trying to display all of these results on the client, have to figure out how to
           //only send the json data over to client once
          //res.json(results);
        })
      })

      .catch(function (error) {
        console.log("ERROR ------------------ \n" + error);
      });

    });

  //console.log(json);


  //this link might be helpful.
  //https://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain

});

app.listen(8080);
console.log('Magic happens on port 8000');
exports = module.exports = app;
