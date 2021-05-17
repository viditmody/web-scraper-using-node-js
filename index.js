var express = require("express");
var request_mod = require('request');
var cheerio = require('cheerio');

var app = express();

//route for "/"
app.get("/", function (request, response){
    response.sendFile(__dirname+"/views/index.html");
});

//route for get after from submission
app.get("/parse-url", function (request, response){

    var webpage = request.query.webpage;
    var sn = 0;

    //cretae response header
    response.writeHead(200, {'Content-Type': 'text/html'});

    if (webpage != "") {

        //Generate HTML to beutify the output
        response.write('<html><head><title>Scrapped Links</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous"><style>h1{margin:50px 0px;text-align:center}h3{margin:20px 0px;}</style></head><body><h1>Scrapped Links</h1><div class="container">');

        //parse data
        request_mod(webpage, function(parse_error, parse_response, body) {

            if (parse_error)
                throw parse_error;
            $ = cheerio.load(body);
            all_page_links = $('a');

            //Total number of links on the webpage
            response.write('<div class="row"><div class="col-md-12"><h3>There are '+$(all_page_links).length+' link(s) on <u>'+webpage+'</u></h3></div></div>');
            response.write('<div class="row"><div class="col-md-12">');

            response.write('<table class="table table-striped"><tr><th></th><th>Link</th><th>Link text</th></tr>');

            $(all_page_links).each(function(i, each_link){
                // Prints all links and link text on the webpage
                response.write('<tr><td>'+ ++sn +'</td><td>'+$(each_link).attr('href')+'</td><td>'+$(each_link).text()+'</td></tr>');
            });

            response.write('</table>');

            response.write('</div></div></div></body></html>');
            //return the response end to print everything
            return response.end();
        });
    } else {
        response.send("Please enter the URL to parse all the links on the page.");
    }
});

//start the server
app.listen(8080);

console.log("Server is running at http://localhost:8080");
