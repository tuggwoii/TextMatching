var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

app.set('port', (process.env.PORT || 8000));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/example', express.static(__dirname + '/example'));
app.engine('html', require('ejs').renderFile);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.render('pages/index.html');
});

app.get('/students', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(fs.readFileSync('resources/students.json'));
});

app.get('/courses', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(fs.readFileSync('resources/courses.json'));
});

app.get('/configs', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(fs.readFileSync('resources/configs.json'));
});

app.post('/students', function (request, response) {
    jsonfile.writeFile('resources/students.json', request.body, function (err) {
        response.setHeader('Content-Type', 'application/json');
        response.send(fs.readFileSync('resources/students.json'));
    });
});

app.post('/courses', function (request, response) {
    jsonfile.writeFile('resources/courses.json', request.body, function (err) {
        response.setHeader('Content-Type', 'application/json');
        response.send(fs.readFileSync('resources/courses.json'));
    });
});

app.post('/configs', function (request, response) {
    jsonfile.writeFile('resources/configs.json', request.body, function (err) {
        response.setHeader('Content-Type', 'application/json');
        response.send(fs.readFileSync('resources/configs.json'));
    });
});

app.get('*', function (request, response) {
    response.status(404).render('pages/404.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
