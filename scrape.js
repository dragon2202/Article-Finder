  const express = require ('express');
  const request_promise = require ('request-promise');
  const cheerio = require ('cheerio');

  var app = express();

  app.use(express.static('public'));

  app.get('/json', function(req, res){
    var offset = 0;
    var index = 0;//0 for Fox 1 for CNet
    //https://stackoverflow.com/questions/1216505/how-to-parse-a-string-in-javascript
    var websites = [];
    var FoxNews = {
      domain: 'https://www.foxnews.com',
      uri: 'https://www.foxnews.com/politics',
      //num: 'div.article-list:nth-child(1) > article',
      text: '.speakable',
      date: '.article-date',
      article: '.title > a',
      //return $('div.article-list:nth-child(1) > article:nth-child(' + (i + 1) + ') div:nth-child(2)> header:nth-child(1) > h2:nth-child(2) > a:nth-child(1)')
      isVideo: function ($, el){
        var string = $(el).attr('href');
        if(string.indexOf("https://video.foxnews.com/") > -1){
          return true;
        } else {
          return false
        }
      }
    }
    var CNET = {
      domain: 'https://www.cnet.com',
      uri: 'https://www.cnet.com/news/',
      num: 5,
      text: '.speakableTextP1',
      date: '.formattedDate',
      article: 'a.assetHed',
      isVideo: function ($, el){
        return false;
      }
    }
    websites.push(FoxNews);
    websites.push(CNET);
    const domain = websites[index].domain;
    /*
    first options for request_promise;
    transform is similar to creating a new Promise;
    */
    const options = {
      uri: websites[index].uri,
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
    
    //https://stackoverflow.com/questions/250688/count-immediate-child-div-elements-using-jquery
    $(websites[index].article).each((i,el) => {
      if(i < 10 + offset){
      if(websites[index].isVideo($, el) == true){
        offset += 1;
      } else {
        let data = {}; //create new Object called data
        data.title = $(el).text().trim(); //text of element and then trim trailing white spaces
        let href = $(el).attr('href'); // link of element attribute 'href'
        //console.log('HREF: ' + href);
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
            data.text = $(websites[index].text).text().trim();
            data.date =  $(websites[index].date).text().trim();
            return data;
          }
        };
        /*
        this will create promise for each
        */
        promises.push(request_promise(options2));
      }
    }
    });

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
      //console.log(error);
    });

  });

  app.listen(8080);
  console.log('Magic happens on port 8080');
  exports = module.exports = app;
