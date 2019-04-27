'use strict'

const piDashApp = require('../content/js/PiDashApp')
const expect = require('chai').should()

describe('PiDashApp module', function(){
    var app;
    var appLog;
    var appPermission;
    var appUser;
    var piDashAppRequest = new Object();
    piDashAppRequest.body = "{\"app\":{\"name\":\"Pickem\",\"appId\":2,\"creatorUserId\":1,\"startCommand\":\"programs/scripts/pidash.run\",\"logs\":[],\"messages\":[],\"status\":\"Stopped\",\"$$hashKey\":\"object:6\"},\"appPermissions\":[{\"permissionId\":2,\"appId\":2,\"appUser\":{\"userName\":null,\"userId\":1},\"groupId\":-1,\"read\":{\"type\":\"Buffer\",\"data\":[1]},\"write\":{\"type\":\"Buffer\",\"data\":[1]},\"execute\":{\"type\":\"Buffer\",\"data\":[1]}}],\"processes\":[]}";
    var responseApp = "{\"app\":{\"name\":\"List Directories\",\"appId\":1,\"creatorUserId\":1,\"startCommand\":\"ls -la\",\"logs\":[]},\"appPermissions\":[{\"permissionId\":1,\"appId\":1,\"appUser\":{\"userName\":null,\"userId\":1},\"groupId\":-1,\"read\":{\"type\":\"Buffer\",\"data\":[1]},\"write\":{\"type\":\"Buffer\",\"data\":[1]},\"execute\":{\"type\":\"Buffer\",\"data\":[1]}}],\"processes\":[]}";
    var responseApps = "{\"apps\":[{\"app\":{\"name\":\"List Directories\",\"appId\":1,\"creatorUserId\":1,\"startCommand\":\"ls -la\",\"logs\":[]},\"appPermissions\":[{\"permissionId\":1,\"appId\":1,\"appUser\":{\"userName\":null,\"userId\":1},\"groupId\":-1,\"read\":{\"type\":\"Buffer\",\"data\":[1]},\"write\":{\"type\":\"Buffer\",\"data\":[1]},\"execute\":{\"type\":\"Buffer\",\"data\":[1]}}],\"processes\":[]},{\"app\":{\"name\":\"Pickem\",\"appId\":2,\"creatorUserId\":1,\"startCommand\":\"programs/scripts/pidash.run\",\"logs\":[]},\"appPermissions\":[{\"permissionId\":2,\"appId\":2,\"appUser\":{\"userName\":null,\"userId\":1},\"groupId\":-1,\"read\":{\"type\":\"Buffer\",\"data\":[1]},\"write\":{\"type\":\"Buffer\",\"data\":[1]},\"execute\":{\"type\":\"Buffer\",\"data\":[1]}}],\"processes\":[]}],\"status\":\"success\"}";
    describe("'AppLog'", function() {
        it("Object for holding App Log attributes",function() {
            appLog = new piDashApp.AppLog(5,1,"path/to/log","log1");
            appLog.should.have.a.property('id');
            appLog.id.should.equal(5);
            appLog.should.have.a.property('appId');
            appLog.appId.should.equal(1);
            appLog.should.have.a.property('path');
            appLog.path.should.equal("path/to/log");
            appLog.should.have.a.property('name');
            appLog.name.should.equal("log1");

        });
    });

    describe("'App'", function() {
        it("Object for holding App attributes",function() {
            app = new piDashApp.App("testApp",1,2,"./startTestApp",[appLog]);
            app.should.have.a.property('name');
            app.name.should.equal("testApp")
            app.should.have.a.property('appId');
            app.appId.should.equal(1);
            app.should.have.a.property('creatorUserId');
            app.creatorUserId.should.equal(2);
            app.should.have.a.property('startCommand');
            app.startCommand.should.equal("./startTestApp");
            app.should.have.a.property('logs');
            app.logs[0].should.equal(appLog);
        });
    });

    describe("'PiDashApp'",function() {
        it("Object for holding PiDashApp attributes", function() {
            var myPiDashApp = new piDashApp.PiDashApp()
        });
    });

    describe("buildPiDashAppFromResponse with string",function() {
        it("Object for holding PiDashApp attributes", function() {
            var myPiDashApp = piDashApp.buildPiDashAppFromResponse(responseApp);
            myPiDashApp.should.be.a('Object');
            (myPiDashApp instanceof piDashApp.PiDashApp).should.equal(true);
            myPiDashApp.app.name.should.equal("List Directories");
            myPiDashApp.app.appId.should.equal(1);
            myPiDashApp.app.creatorUserId.should.equal(1);
            myPiDashApp.app.startCommand.should.equal("ls -la");
            myPiDashApp.appPermissions[0].permissionId.should.equal(1);
            myPiDashApp.appPermissions[0].appId.should.equal(1);
            (myPiDashApp.appPermissions[0].appUser instanceof piDashApp.AppUser).should.equal(true);
            (myPiDashApp.appPermissions[0].appUser.userName == null).should.equal(true);
            myPiDashApp.appPermissions[0].appUser.userId.should.equal(1);
            myPiDashApp.appPermissions[0].groupId.should.equal(-1);
        });
    });

    describe("buildPiDashAppFromResponse with JSON Object",function() {
        it("Object for holding PiDashApp attributes", function() {
            var myPiDashApp = piDashApp.buildPiDashAppFromResponse(JSON.parse(responseApp));
            myPiDashApp.should.be.a('Object');
            (myPiDashApp instanceof piDashApp.PiDashApp).should.equal(true);
            myPiDashApp.app.name.should.equal("List Directories");
            myPiDashApp.app.appId.should.equal(1);
            myPiDashApp.app.creatorUserId.should.equal(1);
            myPiDashApp.app.startCommand.should.equal("ls -la");
            myPiDashApp.appPermissions[0].permissionId.should.equal(1);
            myPiDashApp.appPermissions[0].appId.should.equal(1);
            (myPiDashApp.appPermissions[0].appUser instanceof piDashApp.AppUser).should.equal(true);
            (myPiDashApp.appPermissions[0].appUser.userName == null).should.equal(true);
            myPiDashApp.appPermissions[0].appUser.userId.should.equal(1);
            myPiDashApp.appPermissions[0].groupId.should.equal(-1);
        });
    });

    describe("buildPiDashAppsFromResponse",function() {
        it("Object for holding PiDashApp attributes", function() {
            var myPiDashApps = piDashApp.buildPiDashAppsFromResponse(responseApps);
            myPiDashApps.should.be.a('Object');
            var firstKey = Object.keys(myPiDashApps)[0];
            (myPiDashApps[firstKey] instanceof piDashApp.PiDashApp).should.equal(true);
            myPiDashApps[firstKey].app.name.should.equal("List Directories");
            myPiDashApps[firstKey].app.appId.should.equal(1);
            myPiDashApps[firstKey].app.creatorUserId.should.equal(1);
            myPiDashApps[firstKey].app.startCommand.should.equal("ls -la");
            myPiDashApps[firstKey].appPermissions[0].permissionId.should.equal(1);
            myPiDashApps[firstKey].appPermissions[0].appId.should.equal(1);
            (myPiDashApps[firstKey].appPermissions[0].appUser instanceof piDashApp.AppUser).should.equal(true);
            (myPiDashApps[firstKey].appPermissions[0].appUser.userName == null).should.equal(true);
            myPiDashApps[firstKey].appPermissions[0].appUser.userId.should.equal(1);
            myPiDashApps[firstKey].appPermissions[0].groupId.should.equal(-1);
        });
    });


});

