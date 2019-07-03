$(document).ready(function() {
    $('.tabs').tabs();
    getTitles();
  });

  function getTitles() {
      var xhttpr = new XMLHttpRequest();
      xhttpr.onreadystatechange = () => {
          if (xhttpr.readyState == 4 && xhttpr.status == 200) {
            responseText = xhttpr.responseText;
              if (responseText) {
                  var parsed = JSON.parse(responseText); //json -> js object
                  console.log(parsed);
                  paginate(parsed.articles);
              }
          }
      };
      xhttpr.open("get", "../json", true);
      xhttpr.send();
  }

  function paginate(text123){
    var container = $('#pagination');
        var options = {
          dataSource: text123,
          callback: function (response, pagination) {
            //window.console && console.log(response, pagination);

            var dataHtml = '<ul class = "collapsible expandable" id = "wrapper">';
            $.each(response, function (index, item) {
              dataHtml += '<li>';
              dataHtml += '<div class="collapsible-header"> <a href = "#">' + item.title + '</a></div>';
              dataHtml += '<div class="collapsible-body">'
              dataHtml += '<a href="'+ item.link + '" target="_blank">' + item.text + '</a>';
              dataHtml += '</div>'
              dataHtml += '</li>';
            });
            dataHtml += '</ul>';
            container.prev().html(dataHtml);

            $('.collapsible').collapsible();
          }
        };
        container.pagination(options);
  }
//function to make the Search Bar work
  function searchFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById('myinput'); //from searchbar
    filter = input.value.toUpperCase();//UpperCase the input to match with the list
    ul = document.getElementById('wrapper'); //store index html unorderedlist
    li = ul.getElementsByTagName('li');//stores list item in array from unordered list


    //loops through the whole array and decides which items to display
    for(i=0 ; i< li.length; i++){
        a = li[i].getElementsByTagName('a')[0];
        if(a.innerHTML.toUpperCase().includes(filter)){//does not work on internet explorer
            li[i].style.display = "";
        }
        else{
            li[i].style.display = 'none';
        }
    }
}