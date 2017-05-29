var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var methodOverride = require('method-override');

//requring face route
var faceRoute = require('./app/routes/face.js');
//requiring oxfort for to use face api
var oxford = require('project-oxford'),
client = new oxford.Client('0bd837cc949249bea74f91fd34a55d69');


//directs server to static index.html file
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded


app.get('/', function(req, res){
    res.send('/face/detect');
});



app.use('/face/',faceRoute);


app.listen(3000);
console.log('Working on 3000');
