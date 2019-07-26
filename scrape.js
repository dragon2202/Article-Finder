  const express = require ('express');
  const request_promise = require ('request-promise');
  const cheerio = require ('cheerio');

  var app = express();

  app.use(express.static('public'));

  app.get('/json', function(req, res){
    const domain = '';

    /*
    first options for request_promise;
    transform is similar to creating a new Promise;
    */
    const options = {
      uri: 'https://www.foxnews.com/',
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var json = {}; //new object  json

    /*
    passed first options. after cheeio successfully loaded the html (transform);
    created js object (json) to put all data ;
    created array for promise because doing multiple promises
    to webscrape first paragraph of the actual article
    */
    request_promise(options)
    .then(function ($) {
      var promises = []; //creating a new array of promises
      json.articles = [] ; //new array  articles
    
    
//    for(var i = 0; i < 15; i++){
//      var article = $('div.article-list:nth-child(1) > article:nth-child(' + (i + 1) + ') div:nth-child(2)> header:nth-child(1) > h2:nth-child(2) > a:nth-child(1)');
//     console.log(article.attr('href'));
//    }
    //var site2 = $('div.article-list:nth-child(1) > article:nth-child(2) > div:nth-child(2) > header:nth-child(1) > h2:nth-child(2) > a:nth-child(1)');
    //var site = $('div.article-list:nth-child(1) > article:nth-child(1) > div:nth-child(2) > header:nth-child(1) > h2:nth-child(2) > a:nth-child(1)');
    //var site2 = $('.m  .a').attr('href');
    //console.log(site2);
    //https://stackoverflow.com/questions/250688/count-immediate-child-div-elements-using-jquery
    var num = $('div.article-list:nth-child(1) > article').length;
    console.log(num);
    for(var i = 0; i < num; i++){
      var article = $('div.article-list:nth-child(1) > article:nth-child(' + (i + 1) + ') div:nth-child(2)> header:nth-child(1) > h2:nth-child(2) > a:nth-child(1)');
      let data = {}; //create new Object called data
      data.title = $(article).text().trim(); //text of element and then trim trailing white spaces
      let href = $(article).attr('href'); // link of element attribute 'href'
      data.link = domain.concat(href);
      //console.log(data.link);
      /*
      second options for request_promise -
      cheerio will load data.link ;
      select the text from <p class = '.speakableTextP1' ></p>;
      put that text in data.text in json
      */
      const options2 = {
        uri: data.link,
        transform: function (body) {
          const $ =  cheerio.load(body);
          data.text = $('.speakable').text().trim();
          data.date =  $('.article-date').text().trim();
          return data;
        }
      };
      /*
      this will create promise for each
      */
      promises.push(request_promise(options2));
        
    };

      /*
      waiting for all promises to finish;
      will return an array of results, so loop through each result;
      push each of the results [ data.text (from options2) ] into json;
      then send the json to the response object
      */
      Promise.all(promises)
      .then((results) => {
        for (var i = 0 ; i < results.length ; i ++){
          json.articles.push(results[i]);
        }
        return json;
      })
      .then(function(results) {
        //console.log(results);
        res.json(results);
      })
    })
    .catch(function (error) {
      console.log(error);
    });

  });

  app.listen(8080);
  console.log('Magic happens on port 8080');
  exports = module.exports = app;
