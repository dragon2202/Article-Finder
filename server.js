const express = require ('express');
const request = require ('request');
const cheerio = require ('cheerio');
const fs      = require ('fs');
var app       = express();
var app2      = express();
const CNETurl = 'https://www.cnet.com/news';
const CNETurl2 = 'https://www.cnet.com/';// to concatonate with link name

app.use(express.static('public'))
app2.use(express.static('public'))

//webscrape cnet.com/news for the links first
//webscrape the links


app.get('/json', function(req, res){

  request(CNETurl, (error,response,html) => {
    if(!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      // const mainContent = $('.main-secondary');
      // console.log(mainContent.find('h2.title').text());
      // console.log(mainContent.text());
      //const output = mainContent.next().next().children('article').next().text();
      // console.log(output);
      var json = {  }; //new object  json
      json.articles = [] ; //new array  articles

      var hyperArray = { }; //object for hyperlinks
      hyperArray.href = []; //array for all hyperlinks

      //for each <a class = assetHed></a> , add the text of this node to the JSON
      
      $('a.assetHed').each((i,el) => {
        if(i < 10){//limits the amount of webscrape
        var title = {}; //create new Object called titles
        //var hyperLink = {};//create new Object called links

        var item = $(el).text().trim(); //text of element and then trim trailing white spaces
        var link = $(el).attr('href'); // link of element attribute 'href'
        //console.log(item);

        title.name = item; // {"name": item}
        const hyperlink = CNETurl2.concat(link);
        title.linkName = hyperlink; // {"linkName": link}
        
        
        title.string = string(hyperlink);;//wont return FIX
        console.log(title.string);
        //console.log(string(hyperlink));

        json.articles.push(title); //push the title to the articles array
        //json.articles.push(hyperLink);//hyperArray.href.push(hyperLink);
        
        }
      })
      
    }

    else {
      console.log('error happened :' + error);
    }

jsonString = JSON.stringify(json);
fs.writeFile('output.json', jsonString , function(err){
console.log('File successfully written! - Check your project directory for the output.json file');
})
    res.json(json); //sends a JSON response; converted to a JSON string using JSON.stringify().
    //res.json(hyperArray); //sends a JSON response; converted to a JSON string using JSON.stringify().

  });

})


let string = function(link){
  var text;
  //app2.get('/', function(req, res){

    request(link, function(error, response, html){
      if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('p.speakableTextP1').each((i,el) => {
          text = $(el).text().trim();
          console.log(text);
          return text;//dont work??
          
        })
      }
      else {
        console.log('error happened :' + error);
      }
    })
 //})
  
}


app.listen(8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;