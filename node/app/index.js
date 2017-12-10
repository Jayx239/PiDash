const server = require('./Server');
const express = server.express;
const app = server.app;
var winston = require('./Logger');
var PiSys = require('./PiSystem');
var logger = winston.logger; /* Get configured winston logger */
var validation = require('./Validation');

app.set('view engine','ejs');
app.set('views','./views');
app.use('/bootstrap', express.static('node_modules/bootstrap'));
app.use('/jquery', express.static('node_modules/jquery'));
app.use('/tooltip',express.static('node_modules/tooltip.js'));
app.use('/popper',express.static('node_modules/popper.js'));
app.use('/content',express.static(__dirname + '/../content'));
app.use('/angular',express.static('node_modules/angular'));
app.use('/angular-app',express.static(__dirname + '/../angular-app'));

app.get('/',function(req,res) {
	logger.info("/");
	res.redirect('/Dashboard/');
});

app.get('/Dashboard/',function(req,res) {
	logger.info("/Dashboard/");
	res.render('dashboard');
});

/* PiSystem API */
app.get('/App/System/GetCpus', function(req,res) {
	res.json(PiSys.getCpus());
});

app.get('/App/System/Memory',function(req,res) {
	res.json(PiSys.getMemory());
});

app.get('/App/System/LoadAverage', function(req,res) {
	res.json(PiSys.getLoadAverage());
});

