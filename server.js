const express = require ('express');
const request_promise = require ('request-promise');
const cheerio = require ('cheerio');

var app = express();

app.use(express.static('public'));

app.get('/json', function(req, res){

  const domain = 'https://www.cnet.com';

  /*
  first options for request_promise;
  transform is similar to creating a new Promise;
  */
  const options = {
    uri: 'https://www.cnet.com/news/',
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
    /*
    for each <a class = assetHed></a> , add the text and href of this node to the JSON
    */
    $('a.assetHed').each((i,el) => {
      //if (i<3) { //testing only 3 elements
        let data = {}; //create new Object called data
        data.title = $(el).text().trim(); //text of element and then trim trailing white spaces
        let href = $(el).attr('href'); // link of element attribute 'href'
        data.link = domain.concat(href);

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
            data.text = $('.speakableTextP1').text().trim();
            data.date =  $('.formattedDate').text().trim() + ' ' + $('.formattedTime').text().trim();
            return data;
          }
        };
         /*
          this will create promise for each
         */
        promises.push(request_promise(options2));
      //}
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
    console.log(error);
  });
});

app.listen(8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;
