var serve = require('koa-static');
var views = require('swig');
var koa = require('koa');
var fs = require('fs');
var readline = require('readline');
var app = koa();
app.use(serve('views/pages'));

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
 
app.use(function *(){
    this.body = views.renderFile('views/pages/index.html', { product:  'zsdfszd'});
});

readInput();
app.listen(3000);