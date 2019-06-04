$(document).ready(function() {
    $('.tabs').tabs();
    $('.collapsible').collapsible();
    getTitles();
  });



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
  function createTitles(article) {
    const ulDiv = document.getElementById('LIST');//grabs ID of ul from index.html

    const ListItem = document.createElement("li");//create list item

    //Creates List Header
    const ListHeader = document.createElement("div");
    ListHeader.setAttribute("class", "collapsible-header");
    const nameText = document.createTextNode(article.name);
    ListHeader.appendChild(nameText);//appends article names to the header

    //Creates List Body, text hidden in collapsiable
    var ListBody = document.createElement("div");
    ListBody.setAttribute("class", "collapsible-body");
    var ListText = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...";
    const textNode = document.createTextNode(ListText);

    ListBody.appendChild(textNode);//appends text to the div called ListBody

    ListItem.appendChild(ListHeader);
    ListItem.appendChild(ListBody);

    ulDiv.appendChild(ListItem);
  }
