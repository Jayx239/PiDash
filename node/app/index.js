const express = require('express');
const app = express();
var winston = require('winston')
var port = 4656;
app.set('view engine','ejs');
app.set('views','./views')
app.use('/bootstrap', express.static('/../node_modules/bootstrap'));
app.use('/content',express.static(__dirname + '/../content'));

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

app.listen(port,function(){
	logger.info("Listening on port " + port);
});
