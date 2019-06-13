const express = require ('express');
const request = require ('request');
const cheerio = require ('cheerio');
const rp = require('request-promise');
const fs = require ('fs');
var app       = express();
var limit = 3;
var parameters = ['https://www.cnet.com/news','https://www.cnet.com'];
app.use(express.static('public'))
//https://stackoverflow.com/questions/12101687/nested-requests-are-blocking
https://stackoverflow.com/questions/41003832/return-multiple-promises-from-for-loop
var firstRequest = function(parameters, num){
    request(parameters[0], function(error, response, data){
        if(error){
           console.log(error);
        }
        var json = {};
        json.articles = [];
        var returnVal = null;
        const $ = cheerio.load(data);
        $('a.assetHed').each((i,el) => {
        if(i < num){//limits the amount of webscrape
            var articleItem = {}; //create new Object called titles
            
            var articleName = $(el).text().trim(); //text of element and then trim trailing white spaces
            var link = $(el).attr('href'); // link of element attribute 'href'
  
            articleItem.name = articleName; // {"name": articleName}
            redirectLink = parameters[1].concat(link);
            articleItem.link = redirectLink;
            var url = redirectLink;
            //https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9
            secondRequest(url, i).then(function(item){
                returnVal = item;
            }).catch(function(error){
                console.log(error);
            });
            console.log(returnVal);
            articleItem.text = returnVal;
            json.articles.push(articleItem);
            
            
            //articleItem.text = returnVal;
            //console.log(newLink);
            }
            
        })
        console.log(json);
        //console.log(typeof(json.articles[1]));
   });
}

var secondRequest = function(url, index){
    return new Promise(function(resolve, reject){
    //var url = info.articles[i].link;
    console.log("URL: " + url);
    console.log("INDEX: " + index);
    request(url, function(error, response, data){
        if(error){
           console.log(error);
        }
        const $ = cheerio.load(data);
        $('p.speakableTextP1').each((i,el) => {
            var text= $(el).text().trim();
            try {
                resolve(text);
            } catch (error) {
                reject(e);
            }
           //console.log(articleText);
           //var object = Object.assign(info.articles[i], articleText);
           //info.articles[i] = text;
        })
    });
    });

}



firstRequest(parameters, limit);

//app.get('/json', function(req, res){
  // console.log('booty');
  // firstRequest(parameters[0]);
//})

//jsonString = JSON.stringify(info);
//fs.writeFile('output.json', jsonString , function(err){
//   console.log('File successfully written! - Check your project directory for the output.json file');
//})
//console.log("Keys: " + Object.keys(info.articles));//article length
//for (i = 0; i < Object.keys(info.articles); i++) {
   //console.log(info.articles[i].link);
//}

//secondRequest(json, num).then(function(item){
//    returnVal = item;
//}).catch(function(error){
//    console.log(error);
//});