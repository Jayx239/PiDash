'use strict'

const sysMonitor = require('./PiSystem')
const expect = require('chai').should()

describe('PiSystem module', () => {

	describe("'getMemoryUsage'",() => {
		it("Function to get current memory usage", () => {
			sysMonitor.getMemoryUsage().should.be.a('number')
		})
	})

	describe("'getMemory'",() => {
		it("Function to get system total/available memory", () => {
			sysMonitor.getMemory().should.have.a.property('total')
			sysMonitor.getMemory().should.have.a.property('free')
		})
	})	

	describe("'getLoadAverage'",() => {
		it("Function average load", () => {
			sysMonitor.getLoadAverage().should.have.lengthOf(3)
		})
	})	
})

