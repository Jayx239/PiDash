const express = require('express');
const app = express();
var winston = require('winston');
var PiSys = require('./PiSystem');
var port = 4656;
app.set('view engine','ejs');
app.set('views','./views')
app.use('/bootstrap', express.static('node_modules/bootstrap'));
app.use('/jquery', express.static('node_modules/jquery'));
app.use('/tooltip',express.static('node_modules/tooltip.js'));
app.use('/popper',express.static('node_modules/popper.js'));
app.use('/content',express.static(__dirname + '/../content'));
app.use('/angular',express.static('node_modules/angular'));
app.use('/angular-app',express.static(__dirname + '/../angular-app'));

/* Configure winston logger */
var logger = new (winston.Logger) ({
	transports: [
		new (winston.transports.Console) ({name:'console'}),
		new (winston.transports.File) ({name: "error", filename: './logs/error.log',level: 'error' }),
		new (winston.transports.File) ({name: "master", filename: './logs/master.log',level: 'info'})
	]
})

app.get('/',function(req,res) {
	logger.info("/");
	res.redirect('/Dashboard/');
})
app.get('/Dashboard/',function(req,res){
	logger.info("/Dashboard/");
	res.render('dashboard');
})

/* PiSystem API */
app.get('/App/System/GetCpus', function(req,res) {
	res.json(PiSys.getCpus());
})

app.get('/App/System/Memory',function(req,res){
	res.json(PiSys.getMemory());
})

app.get('/App/System/LoadAverage', function(req,res) {
	res.json(PiSys.getLoadAverage());
})

app.listen(port,function(){
	logger.info("Listening on port " + port);
});
