const os = require('os');


function getCpus() {
	return os.cpus()
}

function getMemoryUsage() {
    return (1-(os.freemem()/os.totalmem()))
}

function getMemory() {

	return {
		"memory": {
			"total": os.totalmem(),
			"free": os.freemem(),
			"usage": getMemoryUsage()
		}
	}
}

function getLoadAverage(){
	return os.loadavg()
}

module.exports = {
	getCpus : getCpus,
	getMemoryUsage : getMemoryUsage,
	getMemory : getMemory,
	getLoadAverage : getLoadAverage
};
