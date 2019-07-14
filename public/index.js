$(document).ready(function() {
    /* initialization of the tabs Materialize */
    $('.tabs').tabs();
    /* initialization of the dropdown Materialize with options*/
    $('.dropdown-trigger').dropdown({
      alignment:'center',
      coverTrigger:false,
      constrainWidth: false
    });

    getTitles();

    /*
      functions to sort the results of the scrape
    */
    function sortByNewest(a,b) {
      return new Date(b.date) - new Date(a.date);
    }

    function sortByOldest(a,b) {
      return new Date(a.date) - new Date(b.date);
    }

    function sortByAlpha(a,b) {
      return a.title.localeCompare(b.title);;
    }

    /*
      Switch function when user clicks on one of the dropdown options
    */
    $('.sort').click(function(event) {
      switch(this.id) {
        case 'default':
          getTitles();
          event.preventDefault();
          break;
        case 'recent':
          getTitles(sortByNewest);
          event.preventDefault();
          break;
        case 'oldest':
          getTitles(sortByOldest);
          event.preventDefault();
          break;
        case 'alpha':
          getTitles(sortByAlpha);
          event.preventDefault();
          break;
        default:
          event.preventDefault();
      }
    });
  });

  /*
  Create a new XMLHttpRequest object;
  Opens the /json (server) by using the GET HTTP method;
  Send the XMLHttpRequest;
  When the status is 200 and readyState is 4
    parse the JSON data and sort it by user's choice
  */
  function getTitles(sorted) {
    var xhttpr = new XMLHttpRequest();
    xhttpr.onreadystatechange = () => {
        if (xhttpr.readyState == 4 && xhttpr.status == 200) {
          responseText = xhttpr.responseText;
            if (responseText) {
                var parsed = JSON.parse(responseText); //json -> js object
                console.log(parsed);
                if(sorted){
                  parsed.articles.sort(sorted);
                }
                paginate(parsed.articles);
            }
        }
    };
    xhttpr.open("get", "../json", true);
    xhttpr.send();
  }


  /*
  https://pagination.js.org/ - following the normal example
  */

  function paginate(text123){
    var container = $('#pagination');
        var options = {
          dataSource: text123,
          callback: function (response, pagination) {
            var htmlData = '<ul class = "collapsible expandable">';
            $.each(response, function (index, item) {
              htmlData += '<li>';
              htmlData += '<div class="collapsible-header">' + item.title + '</div>';
              htmlData += '<div class="collapsible-body">';
              htmlData += '<p>' + item.date + '</p>';
              htmlData += '<p>' + item.text + '</p>';
              htmlData += '<a href="'+ item.link + '" target="_blank"> Read More ... </a>';
              htmlData += '</div>';
              htmlData += '</li>';
            });
            htmlData += '</ul>';
            container.prev().html(htmlData);
            $('.collapsible').collapsible();
          }
        };
        container.pagination(options);
  }
