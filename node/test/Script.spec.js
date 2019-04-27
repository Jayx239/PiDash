'use strict'

const script = require('../content/js/Script')
const expect = require('chai').should()

describe('Script module', function(){

    describe("'Script'",function() {
        it("Object for storing Script attributes", function() {
            var myScript = new script.Script("test app","path/to/app","startcommand","app.js","arg1 arg2");
            myScript.appName.should.equal("test app");
            myScript.basePath.should.equal("path/to/app");
            myScript.startCommand.should.equal("startcommand");
            myScript.executableName.should.equal("app.js");
            myScript.arguments.should.equal("arg1 arg2");
        });
    });

    describe("'buildScriptFromRequest'", function() {
        it("Function to create a Script from a web request",function() {
            var request = "{\"script\":{\"appName\":\"testApp\",\"basePath\":\"path/to/appbase\",\"startCommand\":\"node\",\"executableName\":\"app.js\",\"arguments\":\"arg1 arg2 arg3\"}}";
            var myScript = script.buildScriptFromRequest(request);
            myScript.appName.should.equal("testApp");
            myScript.basePath.should.equal("path/to/appbase");
            myScript.startCommand.should.equal("node");
            myScript.executableName.should.equal("app.js");
            myScript.arguments.should.equal("arg1 arg2 arg3");
        });
    });
    
});

