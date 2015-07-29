var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");

var commonHeaders = {'Content-Type': 'text/html'};

//Handle HTTP route GET / and POST / ie. Home
function home(request, response) {
  if (request.url === "/") {
    //if url == '/' && GET
    if (request.method.toLowerCase() === "get") {

    response.writeHead(200, commonHeaders);
    renderer.view('header', {}, response);
    renderer.view('search', {}, response);
    renderer.view('footer', {}, response);
    response.end();

    } else {
      //else method is POST
        //get the post data from body
        request.on('data', function(postBody) {
          //extract the username
          var query = querystring.parse(postBody.toString());
          //redirect to /:username
          response.writeHead(303, {'Location': '/' + query.username});
          response.end();
        });
        
    }

  }
}

//Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
  //if url == "/...."
  var username = request.url.replace("/", "");
  if(username.length > 0) {
    response.writeHead(200, commonHeaders);  
    renderer.view("header", {}, response);    
    
    //get json from Treehouse
    var studentProfile = new Profile(username);
    //on "end"
    studentProfile.on("end", function(profileJSON){
      //show profile
      
      //Store the values which we need
      var values = {
        avatarUrl: profileJSON.gravatar_url, 
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }
      //Simple response
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
        
    //on "error"
    studentProfile.on("error", function(error){
      //show error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });
      
  }
}
//===========================================//
//   HTTP:'Content-Type' request handler    //
//=========================================//
// function styleAndscript(request, response) {
//     if (request.url.indexOf('.css') != -1) {
//         response.writeHead(200, {'Content-Type': 'text/css'});
//         renderer.contentType('/views' + request.url, request, response);
//         response.end();
//     }
//     if (request.url.indexOf('.js') != -1) {
//         response.writeHead(200, {'Content-Type': 'text/javascript'});
//         renderer.contentType('/' + request.url, request, response);
//         response.end();
//     }
//     if (request.url.indexOf('.jpg') != -1) {
//         response.writeHead(200, {'Content-Type': 'image/jpeg'});
//         renderer.contentType('/views' + request.url, request, response);
//         response.end();
//     }
//     if (request.url.indexOf('.png') != -1) {
//         response.writeHead(200, {'Content-Type': 'image/png'});
//         renderer.contentType('/views' + request.url, request, response);
//         response.end();
//     }
// }

// module.exports.styleAndscript = styleAndscript;
module.exports.home = home;
module.exports.user = user;












