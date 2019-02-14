var express = require("express");
var app = express();

var Project1Data = require('../Projects/Project #1 - To-Do/data.json');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/project1data", function (req, res, next) {
    res.send(Project1Data);
});

app.listen(5000, () => console.log('Example app listening on port 5000!'))