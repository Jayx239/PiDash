const server = require('./Server');
const express = server.express;
const app = server.app;
var validation = require('./Validation');
var winston = require('./Logger');
var PiSys = require('./PiSystem');
/* Get configured winston logger */
var logger = winston.logger;
var Process = require('./routes/ProcessRoute');
var logonRegister = require('./routes/LogonRegisterRoute');
var account = require('./Account');
var baseProvider = require('./BaseProvider');
var piDashAppRoutes = require("./routes/PiDashAppRoute");

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/bootstrap', express.static('node_modules/bootstrap'));
app.use('/jquery', express.static('node_modules/jquery'));
app.use('/tooltip', express.static('node_modules/tooltip.js'));
app.use('/popper', express.static('node_modules/popper.js'));
app.use('/content', express.static(__dirname + '/../content'));
app.use('/angular', express.static('node_modules/angular'));
app.use('/angular-app', express.static(__dirname + '/../angular-app'));

app.get('/', function (req, res) {
    if (req.user)
        res.redirect("/Dashboard")
    else
        res.redirect("/LogonRegister/Logon");
});

app.get('/Logout', function (req, res) {
    req.session.reset();
    res.redirect("/")
});

app.get('/Dashboard/', validation.requireLogon, function (req, res) {
    logger.info("/Dashboard/");
    res.render('dashboard');
});
app.get('/ServerManager', validation.requireAdmin, function (req, res) {
    res.render('servermanager');
});
app.get("/Process/Tester", validation.requireAdmin, function (req, res) {
    res.render('processtester');
});

/* PiSystem API */
app.get('/App/System/GetCpus', validation.requireLogon, function (req, res) {
    res.json(PiSys.getCpus());
});

app.get('/App/System/Memory', validation.requireLogon, function (req, res) {
    res.json(PiSys.getMemory());
});

app.get('/App/System/LoadAverage', validation.requireLogon, function (req, res) {
    res.json(PiSys.getLoadAverage());
});

/* Start App */
server.startServer(function(success) {
    if(!success) {
        logger.error("Error starting server, shutting down app...");
        process.exit(-1);
    }

});
baseProvider.configureDatabase(function(success) {
    if(!success)
        logger.error("Error configuring database...");
});
