
function loadData() {

/*le "$" pour dire que les variable ce sont des object JQuery
  le second "$" pour select object JQuery
  le "#" pour indiquer l'ID of object
  */
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr +', ' + cityStr;

    $greeting.text('So, you want to live at '+address+' ?');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address+'';
    $body.append('<img class="bgimg" src="' +streetviewUrl+ '">');

    // Your NY Times AJAX request goes her
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=6c87ed11f389464b80aa6afd4e2c06b8'

                    $.getJSON(nytimesUrl, function(data){ 
                       $nytHeaderElem.text('New York Times Articles About '+ cityStr);
                        articles = data.response.docs;
                        for (var i = 0; i < articles.length ; i++) {
                            var article = articles[i];
                            $nytElem.append('<li class="article">'+
                                '<a href="'+article.web_url+'">'+article.headline.main+
                                '</a>'+
                                '<p>' + article.snippet+'</p>'+
                                '</li>');
                        };
                    }).error(function() {
                        $nytHeaderElem.text('The getJSON request has faild');
                      })
    // Wikipedia Ajax request goes here
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr+ '&format=json&callback=wikiCallback';
    //not possible to handle error with JSONP so we use te setTimeout function
    var wikiRequestTimeout = setTimeout(function (){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000)

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function( response ){
            var articlelist = response[1];
            for (var i=0; i<articlelist.length; i++){
                articleStr = articlelist[i]
                articleStr = 'http://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href= "' + wikiUrl + '">' +
                    articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });
    

    return false;
};

$('#form-container').submit(loadData);
