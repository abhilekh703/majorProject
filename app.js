//Importing all the required modules 
const fs = require('fs');


var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Redirecting all the API requests to routes.js file in route folder
var routes = require("./routes/routes.js")(app);


//Starting the server and listening on port number 3000
var server = app.listen(8080, function () {
    console.log("Listening on port %s...", server.address().port);
});
