$(document).ready(function() {
    $('.tabs').tabs();
  });
  //readys collapsible in the HTML
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
  
  window.onload = function(e) {
      e.preventDefault();
      getTitles();
  }
  
  
  function getTitles() {
      var xhttpr = new XMLHttpRequest();
      xhttpr.onreadystatechange = () => {
          if (xhttpr.readyState == 4 && xhttpr.status == 200) {
              if (xhttpr.responseText) {
                  // console.log(xhttpr.responseText);
                  var parsed = JSON.parse(xhttpr.responseText); //json -> js object
                  // console.log(parsed.articles);
                  for (let article of parsed.articles) {
                      createTitles(article);
                  }
              }
          }
      };
      xhttpr.open("get", "../json", true);
      xhttpr.send();
  }
  iteration = 1;
  function createTitles(article) {
    
    const ulDiv = document.getElementById('LIST');//grabs ID of ul from index.html

    const ListItem = document.createElement("li");//create list item
    
    //Creates List Header
    const ListHeader = document.createElement("div");
    ListHeader.setAttribute("class", "collapsible-header");
    const nameText = document.createTextNode(article.name);
    ListHeader.appendChild(nameText);//appends article names to the header
   
    //Creates List Body, text hidden in collapsiable
    //https://stackoverflow.com/questions/29182736/creating-link-in-javascript-and-integrating-it-into-createtextnode
    var ListBody = document.createElement("div");
    ListBody.setAttribute("class", "collapsible-body");
    var hyperLink = document.createElement('p');
    var string = article.linkName;
    var articletext = document.createTextNode(article.text);

    hyperLink.innerHTML = "Link " + iteration++ + ": <a href = " + string + "> " + string + " </a> \n <p>" + articletext + "</p>";

    //const textNode = document.createTextNode(ListText);

    ListBody.appendChild(hyperLink);//appends text to the div called ListBody

    ListItem.appendChild(ListHeader);
    ListItem.appendChild(ListBody);
    
    ulDiv.appendChild(ListItem);
  }
