const server = require('../Server');
const express = server.express;
const app = server.app;
const fs = require('fs');
const helpers = require('../Helpers');
var winston = require('../Logger');
var piDashApp = require('../../content/js/PiDashApp');
var process = require('../Process');
var validation = require('../Validation');

var logger = winston.logger;

const {exec} = require('child_process');

const execFile = require('child_process').execFile;

/* Stores process information for spawned processes */
var processes = process.processes;

/* Executes command and spawns new process */
app.post("/Process/Spawn/", validation.requireLogon, function (req, res) {
    console.log('debug', "Spawning process Command: " + req.body.Command);
    process.spawnProcess(req.body.Command,function(newProcess){

        var response;
        if (newProcess.process.error) {
            logger.error("Error starting process, Pid: " + newProcess.pid);
            response = {"Status": "Error", "Pid": newProcess.pid};
            res.json(response);
        }
        else {
            logger.log('debug', "Process started, Pid: " + newProcess.pid);
            response = {"Status": "Success", "Pid": newProcess.pid};
            res.json(response);
        }
    });
});

/* Action to return console for process with 'pid' */
app.post("/Process/Console/", validation.requireLogon, function (req, res) {
    var pid = req.body.pid;
    console.log('debug', '/Process/Console for pid=' + pid);
    if(processes[pid])
        res.json(processes[pid].messages);
    else
        res.json("{\"Status\":\"Error\"}");
});

app.post("/Process/Command/", validation.requireLogon, function (req, res) {

    var pid = req.body.pid;
    logger.log('debug', "Command Received Command: " + req.body.command);
    var reqProcess = processes[pid];
    if (reqProcess) {
        logger.log('debug', "Valid pid: " + pid);
        reqProcess.writeIn(req.body.command + '\n');
        var response = {"Status": "Success", "Message": "Command executed"};
        res.json(response)
    }
    else {
        logger.log('debug', "Invalid pid: " + pid);
        var response = {"Status": "Error", "Message": "Invalid pid, process not found"};
        res.json(response);
    }
});

/* Action to kill a process */
app.post("/Process/Kill/", validation.requireLogon, function (req, res) {
    var pid = req.body.pid;

    process.killProcess(pid, function(response){
        res.json(response);
    });

});