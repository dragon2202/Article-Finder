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
