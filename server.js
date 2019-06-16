const express = require ('express');
const request = require ('request-promise');
const cheerio = require ('cheerio');
const async = require('async');
const fs      = require ('fs');
var app       = express();

app.use(express.static('public'))

app.get('/json', function(req, res){

  const url = 'https://www.cnet.com/news/';
  const domain = 'https://www.cnet.com';
  //var articleURLs = [];

//https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/

const options = {
  uri: `https://www.yourURLhere.com`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    var json = {  }; //new object  json
    json.articles = [] ; //new array  articles

    //for each <a class = assetHed></a> , add the text of this node to the JSON
    $('a.assetHed').each((i,el) => {
      if (i<3){
      var title = {}; //create new Object called titles
      var item = $(el).text().trim(); //text of element and then trim trailing white spaces
      var link = $(el).attr('href'); // link of element attribute 'href'
      var articlelink = domain.concat(link);
      title.name = item; // {"name": item}
      title.linkName = articlelink; // {"linkName": link}
  })
  .catch((err) => {
    console.log(err);
  });

  request(url, (error,response,html) => {
    if(!error && response.statusCode ==200) {
      const $ = cheerio.load(html);
      var json = {  }; //new object  json
      json.articles = [] ; //new array  articles

      //for each <a class = assetHed></a> , add the text of this node to the JSON
      $('a.assetHed').each((i,el) => {
        if (i<3){
        var title = {}; //create new Object called titles
        var item = $(el).text().trim(); //text of element and then trim trailing white spaces
        var link = $(el).attr('href'); // link of element attribute 'href'
        var articlelink = domain.concat(link);
        title.name = item; // {"name": item}
        title.linkName = articlelink; // {"linkName": link}
        //console.log(title.linkName);
        //var first_paragraph = '';
        //articleURLs.push(articlelink);
        //console.log(articleURLs)

      var  promise1 = function(){
          return new Promise(function(resolve,reject) {
            request(articlelink, (error,response,html) => {
              if (error) {
                reject(error);
              }
              else {

                const $ = cheerio.load(html);
                const first_paragraph = $('.speakableTextP1');
                //title.firstP = first_paragraph;
                resolve(first_paragraph.text());
                //console.log(mainContent.text());
                //json.articles.push(title);
              }
            });
          }).then(function(result) {
            //console.log(result + '\n\n');
            title.text = result;
            //console.log(title);
            return title;
          });
        }

        var prom = async function() {
          const msg = await promise1();
          //console.log(msg)
          json.articles.push(msg);
         //console.log(json);
          return json;

        }

        prom();
        //console.log(prom());
        //var booti = prom().then(funct);
        //console.log(booti.then(function(){console.log('hi')}));

        //console.log(json);
        //console.log(prom());
        // var add = async function(x) { // async function expression assigned to a variable
        //   var a = await resolveAfter2Seconds(20);
        //   var b = await resolveAfter2Seconds(30);
        //   return x + a + b;
        // };
        // promise.then(function(result) {
        //   //console.log(result + '\n\n');
        //   title.text = result;
        //   console.log(title);
        // });
         //push the title to the articles array


          // promise.then(function(result) {
          //   //console.log(result);
          //   json.articles.push(result);
          // });
       }
      })
    }

    else {
      console.log('error happened :' + error);
    }

  //  prom().then(function(json){res.json(json)}); //sends a JSON response; converted to a JSON string using JSON.stringify().
  });




})


app.listen(8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;
