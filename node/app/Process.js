var winston = require('./Logger');
var logger = winston.logger;
var piDashApp = require('../content/js/PiDashApp')

const childProc = require('child_process');

/* Stores process information for spawned processes */
var processes = new Object();

/* Timeout for killing child process's */
var killTimeout = 3000;

/* Function for listening to shell outputs */
function listenToProcess(process) {
    logger.log('Debug', "Started listening Pid" + process.pid);
    var pid = process.pid;
    process.process.stdout.on('data', function(data) {
        logger.log('debug', "Writing to process, Pid: " + process.process.pid + " Command: " + data.toString());
        process.writeOut(data.toString());
        logger.log('debug', data.toString());

    });

    process.process.stderr.on('data', function(data) {
        process.writeErr(data.toString());
        logger.log('debug', "Process Error Code: Pid: " + pid + "Error Code: " + data.toString() );
    });

    process.process.on('close', function(code) {
        process.writeClose("Process closed, Pid: " + process.pid + " Exit code: " + code);
        logger.log('debug', code);
    });
    process.process.on('error', function(code) {
        logger.log('debug', 'Process Error: Pid: ' + pid + " Error Code: " + code);
    });

}

var spawnProcess = function(command, callback) {
    try {
        var childProcess = childProc.exec(command);
    } catch(err){
        logger.error("Error spawining process - Command: " + command);
        callback(err);
        return;
    }

    var pid = childProcess.pid;
    var newProcess = new piDashApp.Process(childProcess,false);
    if(childProcess.error) {
        console.error("Error spawning process: Command: " + command + " Error: " + childProcess.error );
        callback(newProcess);
        return;
    }
    processes[pid] = newProcess;

    try {
    listenToProcess(newProcess);
    }
    catch(err) {
        logger.error("Error listening to process - Pid: " + pid + " Error: " + err);
    }
    if(callback)
        callback(newProcess);
};

var killProcess = function(pid, callback) {
    var command = "pkill -P " + pid;
    logger.debug("Killing process, Pid: " + pid);
    var childProcess = childProc.exec(command,function(error,stdout,stderr){
        var result = new Object();
        if(error) {
            logger.debug("Child process not killed")
        }

        var parentCommand = "kill " + pid;
        var parentProcess = childProc.exec(parentCommand,function(error,stdout,stderr) {
            if(error) {
                logger.debug("Error killing parent process Pid: " + pid);
                result.status = "Error";
                result.message = "Error killing parent";
            }
            else {
                logger.debug("Process killed Pid: " + pid);
                result.status = "Success";
                result.message = "Process killed";
            }
            callback(result);
        });
    });
};

module.exports = {
    listenToProcess: listenToProcess,
    spawnProcess: spawnProcess,
    killProcess: killProcess,
    processes: processes
};
