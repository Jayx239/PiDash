const express = require('express');
const path = require('path');
var winston = require('../Logger');
var logger = winston.logger;
var server = require('../Server');
var app = server.app;
var provider = require('../providers/CredentialProvider');
var validation = require('../Validation');
const responseEngine = require('../ResponseEngine');
const fs = require('fs');

const STATIC_PATH =  '/../../../client/client/dist/client';

const router = express.Router();

//router.get('/', express.static(__dirname + STATIC_PATH));

router.all('/*', function (req, res) {
  const file = req.path;
  logger.info(`File: ${file}`);
  if (file) {
    if (file.includes("..")) {
      res.status(400);
      res.send();
      return;
    }

    const filePath = path.join(__dirname, STATIC_PATH, '/', file);
    logger.info(`filePath: ${filePath}`);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
        return;
    } 
}
    //res.redirect('/v2/');
    res.sendFile(path.join(__dirname, STATIC_PATH, "/index.html"), {}, function (err) {
    });
});


app.use("/v2/", router);

