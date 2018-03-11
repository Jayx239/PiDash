var winston = require('./Logger');
var logger = winston.logger;
var piDashApp = require('../content/js/PiDashApp')

const {exec} = require('child_process');

/* Stores process information for spawned processes */
var processes = new Object();

/* Timeout for killing child process's */
var killTimeout = 3000;

/* Function for listening to shell outputs */
function listenToProcess(process) {
    logger.log('Debug', "Started listening Pid" + process.pid);

    process.process.stdout.on('data', function(data) {
        logger.log('debug', "Writing to process, Pid: " + process.process.pid + " Command: " + data.toString());
        process.writeOut(data.toString());
        logger.log('debug', data.toString());

    });

    process.process.stderr.on('data', function(data) {
        process.writeErr(data.toString());
        logger.log('debug', data.toString());
    });

    process.process.on('close', function(code) {
        process.writeClose("Process closed, Pid: " + process.pid + " Exit code: " + code);
        logger.log('debug', code);
    });

}

var spawnProcess = function(command, callback) {
    var childProcess = exec(command);

    var pid = childProcess.pid;
    var newProcess = new piDashApp.Process(childProcess,false);
    processes[pid] = newProcess;

    listenToProcess(newProcess);
    if(callback)
        callback(newProcess);
};

var killProcess = function(pid, callback) {
    var command = "pkill -P " + pid;
    logger.log('debug', "Killing process, Pid: " + pid);
    var childProcess = exec(command);
    setImmediate(function(){
        var childRetVal = childProcess.returnValue;
        console.log("killing");
        var parentCommand = "kill " + pid;
        var parentProcess = exec(parentCommand);
        var parentRetVal = parentProcess.returnValue;
        var response = {"Status": "Unknown" };
        if(callback)
            callback(response);
    });
};

module.exports = {
    listenToProcess: listenToProcess,
    spawnProcess: spawnProcess,
    killProcess: killProcess,
    processes: processes
};