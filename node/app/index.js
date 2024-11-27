const server = require('./Server');
const express = server.express;
const app = server.app;
const cors = require('cors');
var validation = require('./Validation');
var winston = require('./Logger');
var PiSys = require('./PiSystem');
/* Get configured winston logger */
var logger = winston.logger;
var baseProvider = require('./providers/BaseProvider');
var responseEngine = require('./ResponseEngine');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/bootstrap', express.static('node_modules/bootstrap'));
app.use('/jquery', express.static('node_modules/jquery'));
app.use('/tooltip', express.static('node_modules/tooltip.js'));
app.use('/popper', express.static('node_modules/popper.js'));
app.use('/content', express.static(__dirname + '/../content'));
app.use('/angular', express.static('node_modules/angular'));
app.use('/angular-app', express.static(__dirname + '/../angular-app'));

const corsOptions = {
    origin: [
        'http://0.0.0.0:3656',
        'https://0.0.0.0:3656',
        'http://0.0.0.0:4656',
        'https://0.0.0.0:4656',
        'http://localhost:3656',
        'https://localhost:3656',
        'http://localhost:4656',
        'https://localhost:4656',
        'http://192.168.0.1:3656',
        'https://192.168.0.1:3656',
        'http://192.168.0.1:4656',
        'https://192.168.0.1:4656'
    ]
};

app.use(cors(corsOptions));

/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});*/

/* Don't morgan log these */
var Process = require('./routes/ProcessRoute');
var piDashAppRoutes = require('./routes/PiDashAppRoute');
/* v2 */
const v2Router = require('./routes/AngularV2Route');

app.use(require('morgan')('combined', { stream: logger.stream }));

var logonRegister = require('./routes/LogonRegisterRoute');
var account = require('./routes/AccountRoute');

// Is the users session dead
app.get('/notripped', function (req, res) {
    if (req.user) {
        res.send(true);
        // return success
    } else {
        // return false;
        res.send(false);
    }
});

app.get('/', function (req, res) {
    if (req.user) res.redirect('/Dashboard');
    else res.redirect('/LogonRegister/Logon');
});

app.get('/Logout', function (req, res) {
    req.session.reset();
    responseEngine.redirect(res, '/', {
        successful: true,
        message: 'User logged out'
    });
});

app.get('/Dashboard/', validation.requireLogon, function (req, res) {
    logger.info('/Dashboard/');
    res.render('dashboard');
});
app.get('/ServerManager', validation.requireLogon, function (req, res) {
    res.render('servermanager');
});
app.get('/Process/Tester', validation.requireAdmin, function (req, res) {
    res.render('processtester');
});

/* PiSystem API */
app.get('/App/System/GetCpus', validation.requireLogon, function (req, res) {
    res.json(PiSys.getCpus());
});

app.get('/App/System/Memory', validation.requireLogon, function (req, res) {
    res.json(PiSys.getMemory());
});

app.get(
    '/App/System/LoadAverage',
    validation.requireLogon,
    function (req, res) {
        res.json(PiSys.getLoadAverage());
    }
);

/* Start App */
server.startServer(function (success) {
    if (!success) {
        logger.error('Error starting server, shutting down app...');
        process.exit(-1);
    }
});

baseProvider.configureDatabase(function (success) {
    if (!success) logger.error('Error configuring database...');
});
