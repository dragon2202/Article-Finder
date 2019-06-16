const express = require ('express');
const request_promise = require ('request-promise');
const cheerio = require ('cheerio');

var app       = express();

app.use(express.static('public'))

app.get('/json', function(req, res){

  const options = {
    uri: 'https://www.cnet.com/news/',
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  const domain = 'https://www.cnet.com/';

  //var prom;

  request_promise(options)
    .then(function ($) {
      var json = {}; //new object  json
      json.articles = [] ; //new array  articles

      //for each <a class = assetHed></a> , add the text of this node to the JSON
      $('a.assetHed').each((i,el) => {
        if (i<3) {

          let title = $(el).text().trim(); //text of element and then trim trailing white spaces
          let href = $(el).attr('href'); // link of element attribute 'href'
          var link = domain.concat(href);

          let text = " ";

          let data = {title,link,text}; //create new Object called data

          const options2 = {
            uri: link,
            transform: function (body) {
              return cheerio.load(body);
            }
          };

          request_promise(options2)
            .then(function ($){
              const first_paragraph = $('.speakableTextP1').text();
              data.text = first_paragraph;
              console.log(first_paragraph);
              //console.log("DATA  -  " + data);
            })
            .catch(function(error){
              console.log(error);
            })

          //var articlelink = domain.concat(link);
          // title.name = item; // {"name": item}
          // title.linkName = articlelink; // {"linkName": link}


          //json.articles.push(data);


          // var  promise1 = function(){
          //     return new Promise(function(resolve,reject) {
          //       request(link, (error,response,html) => {
          //         if (error) {
          //           reject(error);
          //         }
          //         else {
          //
          //           const $ = cheerio.load(html);
          //           const first_paragraph = $('.speakableTextP1');
          //           //title.firstP = first_paragraph;
          //           resolve(first_paragraph.text());
          //           //console.log(mainContent.text());
          //           //json.articles.push(title);
          //         }
          //       });
          //     }).then(function(result) {
          //       //console.log(result + '\n\n');
          //       data.text = result;
          //       //console.log(title);
          //       return title;
          //     });
          //   }



        }
      });
      //console.log(json);
    })
    .catch(function (error) {
        console.log(error);
    });

    // var prom = async function() {
    //   const msg = await promise1();
    //   //console.log(msg)
    //   json.articles.push(msg);
    //  //console.log(json);
    //   return json;
    //
    // }

   // prom().then(function(json){res.json(json)});
});

// function promise1(link){
//     return new Promise(function(resolve,reject) {
//       request_promise(link, (error,response,html) => {
//         if (error) {
//           reject(error);
//         }
//         else {
//
//           const $ = cheerio.load(html);
//           const first_paragraph = $('.speakableTextP1');
//           //title.firstP = first_paragraph;
//           resolve(first_paragraph.text());
//           //console.log(mainContent.text());
//           //json.articles.push(title);
//         }
//       });
//     }).then(function(result) {
//       //console.log(result + '\n\n');
//       data.text = result;
//       //console.log(title);
//       return title;
//     });
//   }


app.listen(8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;
