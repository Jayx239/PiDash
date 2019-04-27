'use strict'

const sysMonitor = require('../app/PiSystem')
const expect = require('chai').should()

describe('PiSystem module', function(){

    describe("'getMemoryUsage'",function() {
        it("Function to get current memory usage", function() {
            sysMonitor.getMemoryUsage().should.be.a('number');
        });
    });

    describe("'getMemory'", function() {
        it("Function to get system total/available memory",function() {
            sysMonitor.getMemory().should.have.a.property('memory');
            sysMonitor.getMemory().memory.should.have.a.property('total');
            sysMonitor.getMemory().memory.should.have.a.property('free');
        });
    });

    describe("'getLoadAverage'", function() {
        it("Function average load",function() {
            sysMonitor.getLoadAverage().should.have.lengthOf(3);
        });
    });
});

