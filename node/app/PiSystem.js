const os = require('os')


function getCpus() {
	return os.cpus()
}

function getMemoryUsage() {
	return os.freemem()/os.totalmem()
}

function getMemory() {

	return {
		"total" : os.totalmem(),
		"free" : os.freemem()
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
}
