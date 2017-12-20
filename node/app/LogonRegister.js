var winston = require('./Logger');
var logger = winston.logger;
var server = require('./Server');
var app = server.app;
var provider = require('./Provider');
var validation = require('./Validation');

app.get("/LogonRegister/Logon",function(req,res){
    res.render("logon");
});

app.post("/LogonRegister/Logon", function(req,res){
    logger.log('debug',"Validation started, UserName: " + req.body.UserName);
    provider.getCredentialsByUserName(req.body.UserName,function(returnObject) {
        if(returnObject.Status === validation.Statuses.Error){
            logger.error("User not found, UserName: " + req.body.UserName);
            res.redirect('/');
        }

        if(validation.validateUserPassword(req.body.Password,returnObject.results.Hash, returnObject.results.Salt)) {
            req.session.user = req.body.UserName;
            provider.getAdminByUserId(returnObject.results.UserId, function(returnObject) {
                if(returnObject.Status !== validation.Statuses.Error) {
                    req.session.admin = "granted";
                }
                res.redirect("/");
            });
        }
        res.redirect("/LogonRegister/Logon");
    });
});

app.get("/LogonRegister/Register",function(req,res){
    res.render("register");
});

app.post("/LogonRegister/Register", function(req,res){
    logger.log('debug',"Registration started, UserName: " + req.body.UserName);
    provider.addUserToUsersTable(req.body.UserName, req.body.PrimaryEmailAddress, req.body.FirstName, req.body.MiddleName, req.body.LastName, req.body.BirthDay, req.body.BirthMonth, req.body.BirthYear,function(result){
        if(result.Status === validation.Statuses.Error) {
            console.error("Error registering user");
            res.json(result);
        }
        else {
            console.info("User registered, UserName: " + req.body.UserName);
            res.json(result);
        }
    });
});