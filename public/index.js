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

            var dataHtml = '<ul class = "collapsible expandable">';
            $.each(response, function (index, item) {
              dataHtml += '<li>';
              dataHtml += '<div class="collapsible-header">' + item.title + '</div>';
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
