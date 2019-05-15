// document.addEventListener('DOMContentLoaded', function(){
//     // make the articles show up when loaded.
//     var article = document.getElementById("article");
//     article.style.display = "block";
//     article.className += " active";
// });
//
//
// function openTab(e, tab) {
//   // Declare all variables
//   var i, tabcontent, tablink;
//
//   // Get all elements with class="tab-content" and hide them
//   tabcontent = document.getElementsByClassName("tab-content");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }
//
//   // Get all elements with class="tablinks" and remove the class "active"
//   tablink = document.getElementsByClassName("tab-link");
//   for (i = 0; i < tablink.length; i++) {
//     tablink[i].className = tablink[i].className.replace(" active", "");
//   }
//
//   // Show the current tab, and add an "active" class to the button that opened the tab
//   document.getElementById(tab).style.display = "block";
//   e.currentTarget.className += " active";
// }

$(document).ready(function() {
  $('.tabs').tabs();
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

function createTitles(article) {
  const mainDiv = document.getElementById('main-articles');

  const flexDiv = document.createElement("div");
  const flexDivClass = flexDiv.setAttribute("class", "flex-container");

  const nameDiv = document.createElement("div");
  const nameDivClass = nameDiv.setAttribute("class", "item");

  const nameTxt = document.createTextNode(article.name);


  nameDiv.appendChild(nameTxt);
  flexDiv.appendChild(nameDiv);
  mainDiv.appendChild(flexDiv);
}
