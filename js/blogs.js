var feedmirror = {
    initialize: function (fmSettings) {
      var request = new XMLHttpRequest();
  
      request.open('GET', fmSettings.feedURL, true);
  
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Success!
  
          // Currently only Medium integration is supported
          if (fmSettings.integration == 'medium-embed') {
            // Medium JSON has hijacking code at the beginning
            var data = request.responseText.split('])}while(1);</x>')[1]
            var data = JSON.parse(data);
            fmBuild(fmSettings.integration, data);
          } else {
            console.log('FEEDMIRROR: Integration "' + fmSettings.integration + '" is not supported.');
          }
        } else {
          // We reached our target server, but it returned an error
          console.log("FEEDMIRROR: The server returned an error.");
        }
      };
  
      function fmBuild(integrationType, data) {
        if (integrationType == 'medium-embed') {
          //   console.log(data);
          createHTML(data.payload.references)
        }
      }
  
      request.onerror = function () {
        // There was a connection error of some sort
        console.log('Error fetching FEEDMIRROR feed.');
      };
  
      request.send();
  
      var embeds = new XMLHttpRequest();
      var url = window.location.href;
      var feedId = fmSettings.feedURL
        .split("feedmirror.com")[1]
        .split(".json")[0];
      embeds.open(
        "GET",
        "https://feedmirror.com/embeds?url=" + url + "&feedId=" + feedId,
        true
      );
      embeds.send();
    }
  }
  
  
  var fmSettings = {
    feedURL: 'https://data.feedmirror.com/-LYsKFEm_kzcskpcewoU.json',
    integration: 'medium-embed',
    linkOutText: 'Read more',
    linkToMediumProfileText: 'Subscribe on Medium',
    postsCount: 3,
    element: 'fm-medium-embed'
  };
  feedmirror.initialize(fmSettings);
  
  
  // Shows the feeds
  function createHTML(blogData) {
    console.log("testing..");
    console.log(blogData);
    // Template.registerHelper("date", function(timestamp) {
    //   var curr_date = timestamp.getDate();
    //   var curr_month = timestamp.getMonth();
    //   curr_month++;
    //   var curr_year = timestamp.getFullYear();
    //   result = curr_date + ". " + curr_month + ". " + curr_year;
    //   return result;
    // });
    var rowTamplate = document.getElementById("blogsTemplate").innerHTML;
    // var dataTamplate = document.getElementById("blogSubViews").innerHTML;
    var compiledTamplate = Handlebars.compile(rowTamplate);
    // var viewDataTamplate = Handlebars.compile(dataTamplate);
    var ourGeneratedHTML = compiledTamplate(blogData);
    // ourGeneratedHTML = ourGeneratedHTML + viewDataTamplate(blogData);
  
    var blogsContainer = document.getElementById("blogs-container");
    blogsContainer.innerHTML = ourGeneratedHTML;
    // var blogsSideContainer = document.getElementById("blogsViews");
    // blogsSideContainer.innerHTML = ourGeneratedHTML;
  }
  