var express = require('express');
var app = express();
var fs = require('fs');
var boyerMoore = require('./Boyer-Moore.js');
var readline = require('readline');

app.set('port', (process.env.PORT || 8000));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/example', express.static(__dirname + '/example'));
app.engine('html', require('ejs').renderFile);

var products = [];


function readInput () {
	var reader = readline.createInterface({
		input: fs.createReadStream('resources/product.txt'),
		output: process.stdout,
		terminal: false
	});
	reader.on('line', function(line) {
		products.push(line);
	});
}
 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index.html', { product: products.length});
});

app.get('/search', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
	var queryResult = [];
	console.log(request.query);
	if(request.query.keywords) {
		console.log(request.query.keywords);
		for(var i = 0 ; i < products.length ; i++) {
			var keys = request.query.keywords.split(' ');
			var isMatch = false;
			for(var j = 0; j < keys.length; j++) {
				result = boyerMoore.search(keys[j], products[i]);
				if(result > -1) {
					isMatch = true;
				}
			}
			if(isMatch) {
				queryResult.push({ id: (i+1), name: products[i]});
			}
		}
	}
	
    response.send(JSON.stringify(queryResult));
});

app.get('*', function (request, response) {
    response.status(404).render('pages/404.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

readInput();
