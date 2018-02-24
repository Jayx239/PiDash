'use strict'

    const appManager = require('../app/AppManager');
    const baseProvider = require('../app/BaseProvider');
    const chai = require('chai');
    const expect = chai.should();
    var chaiHttp = require('chai-http');

    chai.use(chaiHttp);
    var piDashApp;
    var generateSamplePiDashApp= function() {
        var logs = [new appManager.AppLog(null,null,"./logs/error.log","Errors"),new appManager.AppLog(null,null,"./logs/master.log","Master Log")];
        var app = new appManager.App("Jasons App",null,'admin','python testapp.py',logs);
        var permissions = [];
        permissions.push(new appManager.AppPermission('admin',true,0,true,true,true));
        piDashApp = new appManager.PiDashApp(app,permissions,null);
    };

    describe('AppManager module', function(){

        before('Setup Test Database', function(done){
            baseProvider.setConfigFile("./config/sqltest.config",function(result) {
                if(result) {
                    baseProvider.runCommand("INSERT INTO Users(UserName,PrimaryEmail,FirstName,MiddleName,LastName,BirthDay,BirthMonth,BirthYear) VALUES('admin','admin@admin.com','admin','admin','admin',1,1,1990);\"", function(result) {

                        generateSamplePiDashApp();
                        done();
                    });
                }
                else
                    done(result);
            });
        });

        describe("'addPiDashApp'",function(){
            it("Function to add a PiDashApp to the database", function(done) {
                appManager.addPiDashApp(piDashApp,function(){
                    appManager.getPiDashAppByDetails(piDashApp, function(savedPiDashApp){
                        savedPiDashApp.should.be.a(appManager.PiDashApp);
                    });
                });
            });
        });

        describe("'getPiDashAppByAppId'", function() {
            it("Function to get PiDashApp by the app id",function() {
                appManager.getPiDashAppByAppId(0,function(app) {
                    app.should.be.a('PiDashApp');
                });
            });
        });

    describe("'getLogsByAppId'", function() {
        it("Function to get logs for an app by the app id",function() {
            appManager.getLogsByAppId(0,function(app) {
                app.should.be.a('Log');
            });
        });
    });

    describe("'getAppPermissionsByAppId'", function() {
        it("Function to get permissions for an app by the app id",function() {
            appManager.getAppPermissionsByAppId(0,function(app) {
                app.should.be.a('AppPermission');
            });
        });
    });
});

