const server = require('./Server');
const express = server.express;
const app = server.app;
const fs = require('fs');
const helpers = require('./Helpers')
var winston = require('./Logger');
var logger = winston.logger;

const { exec } = require('child_process');

const execFile = require('child_process').execFile;

/*var prog = exec('echo "what is up"');
console.log(prog.pid);
prog.stdout.on('data',(data) => {
    console.log(data.toString())
});

var showProcess = exec('ps');

showProcess.stdout.on('data',(data) => {
    console.log(data.toString())
});
*/
var processes = [];
var STDIN = "stdin";//0;
var STDOUT = "stdout";//1;
var STDERR = "stderr";//2;
var CLOSE = "close";//3;

function writeToProcessIn(process, command) {
    logger.log('debug',"Writing to process, Pid: " + process.pid + " Command: " + command);
    process.stdin.write(command);
    processes[process.pid].messages.push(createMessage(STDIN,command));
}

function createMessage(src,message) {
    return {"Source":src,"Message":message};
}

function listenToProcess(childProcess) {
    var pid =  childProcess.pid;
    logger.log('Debug',"Started listening Pid" + pid);


    childProcess.stdout.on('data',(data) => {
        var message = createMessage(STDOUT,data.toString());
        logger.log('debug',message);
        processes[pid]['messages'].push(message);
    });
    childProcess.stderr.on('data',(data) => {
        var message = createMessage(STDERR,data.toString());
        logger.log('debug',message);
        processes[pid]['messages'].push(message);
    });
    childProcess.on('close',(code) => {
        var message = createMessage(CLOSE,"Process closed, Pid: " + pid + " Exit code: " + code);
        processes[pid]['messages'].push(message);
        logger.log('debug',message);
    });

}

app.post("/Process/Spawn/",function(req,res) {
    console.log('debug',"Spawning process Command: " + req.body.Command);
    var childProcess = exec(req.body.Command);

    var pid = childProcess.pid;
    processes.push(pid);
    processes[pid] = [];
    processes[pid]['messages'] = [];
    processes[pid]['process'] = childProcess;

    listenToProcess(childProcess);

    var response;
    if(childProcess.error) {
        logger.error("Error starting process, Pid: " + childProcess.pid);
        response = { "Status":"Error","Pid":childProcess.pid };
        res.json(response);
    }
    else {
        logger.log('debug',"Process started, Pid: " + childProcess.pid);
        response = { "Status":"Success","Pid" : childProcess.pid };
        res.json(response);
    }

});

app.post("/Process/Spawn2/",function(req,res) {
    console.log(req.body.Command);
    var childProcess = exec(req.body.Command);
    logger.info("Process Spawned");
    logger.log('debug',"Process started: Pid: " + childProcess.pid);

    var pid = childProcess.pid;
    processes.push(pid);
    processes[pid] = [];
    processes[pid]['messages'] = [];
    processes[pid]['process'] = childProcess;

    listenToProcess(childProcess);

    var response;
    if(childProcess.error) {
        logger.error("Error starting process, PID: " + childProcess.pid);
        response = { "Status":"Error","Pid":childProcess.pid };
        res.json(response);
    }
    else {
        response = { "Status":"Success","Pid" : childProcess.pid };
        res.json(response);
    }

});

app.post("/Process/Console/",function(req,res){
    var pid = req.body.pid;
    console.log(pid);
    console.log(processes[pid].messages);
    res.json(processes[pid].messages);
});

app.post("/Process/Command/",function (req,res) {

    var pid = req.body.pid;
    logger.log('debug',"Command Received Command: " + req.body.command);

    if(processes[pid]) {
        logger.log('debug',"Valid pid: " + pid);
        var currentProcess = processes[pid]['process'];
        writeToProcessIn(currentProcess, req.body.command + '\n');
        var response = {"Status":"Success","Message":"Command executed"};
        res.json(response)
    }
    else {
        logger.log('debug',"Invalid pid: " + pid);
        var response = {"Status":"Error","Message":"Invalid pid, process not found"};
        res.json(response);
    }
});

app.post("/Process/Kill/",function(req,res){
    var pid = req.body.pid;
    var command = "kill " + pid;
    logger.log('debug',"Killing process, Pid: " + pid);
    var childProcess = exec(command);
    var retVal = childProcess.returnValue;
    var response = {"Status":retVal};
    res.json(response);

});