

var bashSpecifier = "#!/bin/bash";

function Script(appName, basePath, startCommand, executableName, arguments ) {
    this.appName = appName;
    this.basePath = basePath;
    this.startCommand = startCommand;
    this.executableName = executableName;
    this.arguments = arguments;
}

/*
#!/bin/bash
cd basePath
startCommand executableName
*/

Script.prototype.getScriptContents = function(){
    var output = bashSpecifier + "\n";
    output += "echo \"starting " + this.appName + "...\"\n";
    output += "cd " + this.basePath + "\n";
    output += this.startCommand + " " + this.executableName + " " + this.arguments;
    return output;
};

function DefaultScript( appName, basePath, executableName, arguments ) {
    var defaultExecutable = executableName;
    if (defaultExecutable.length > 1)
        if(defaultExecutable[0] != '.' || defaultExecutable[1] != '/')
            defaultExecutable = "./" + executableName;
    Script.call(this,appName,basePath,"",defaultExecutable,executableName,arguments);
}

function NodeScript(appName, basePath, executableName, arguments ) {
    Script.call(this,appName,basePath,"node",executableName,arguments);

}

function JavaScript(appName, basePath, executableName, arguments ) {
    Script.call(this,appName,basePath,"java",executableName,arguments);
}

var buildScriptFromRequest = function(req) {
    var reqJson = tryParseJson(req);
    var scriptReq = reqJson.script;
    return new Script(scriptReq.appName, scriptReq.basePath,scriptReq.startCommand, scriptReq.executableName, scriptReq.arguments);
};


var tryParseJson = function(res) {
    var jsonRes;
    if((typeof res) == 'string')
        jsonRes = JSON.parse(res);
    else
        jsonRes = res;

    return jsonRes;

};

if(typeof module != 'undefined' && module.exports)
    module.exports = {
        Script: Script,
        DefaultScript: DefaultScript,
        NodeScript: NodeScript,
        JavaScript : JavaScript,
        buildScriptFromRequest: buildScriptFromRequest
    };