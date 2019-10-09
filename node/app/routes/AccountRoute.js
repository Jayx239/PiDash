var winston = require('../Logger');
var logger = winston.logger;
var server = require('../Server');
var app = server.app;
var credentialProvider = require('../providers/CredentialProvider');
var validation = require('../Validation');
var responseEngine = require('../ResponseEngine');

app.get("/Account", validation.requireLogon, function (req, res) {
    res.render("account");
});

app.post("/Account/ChangePassword", validation.requireLogon, function (req, res) {
    if (!validation.validPassword(req.body.OldPassword) || !validation.validPassword(req.body.NewPassword) || req.body.NewPassword !== req.body.RepeatNewPassword) {
        res.locals.messages.errors.push("Invalid password");
        responseEngine.render(res,"account",{
            successful: false,
            message: "Invalid password"
        });
        return;
    }
    credentialProvider.getCredentialsByUserName(req.user, function (returnObject) {
        if (returnObject.status === credentialProvider.Statuses.Error || returnObject.results.length < 1) {
            logger.error("Error changing password, user not found, UserName: " + req.user);
            res.locals.messages.errors.push("User not found");
            responseEngine.render(res,"account",{
                successful: false,
                message: "User not found"
            });
        }
        else {
            if (validation.validateUserPassword(req.body.OldPassword, returnObject.results[0].Hash, returnObject.results[0].Salt)) {
                var saltHash = validation.saltHashPassword(req.body.NewPassword);
                credentialProvider.updateCredentialsByUserName(req.user, saltHash.passwordHash, saltHash.salt, function (result) {
                    if (result.status === credentialProvider.Statuses.Error) {
                        logger.error("Error updating User password, UserName: " + req.user);
                        res.locals.messages.errors.push("Error resetting password");

                        responseEngine.render(res,"account",{
                            successful: false,
                            message: "Error reseting password"
                        });
                    }
                    else if (result.status === credentialProvider.Statuses.Success) {
                        logger.info("User password updated, UserName: " + req.user);
                        res.locals.messages.success.push("Password reset successfully")
                        responseEngine.render(res,"account",{
                            successful: true,
                            message: "Password reset"
                        });
                    }
                    else {
                        responseEngine.render(res,"account",{
                            successful: false,
                            message: "Unexpected error"
                        });
                    }
                });
            }
            else{
                responseEngine.render(res,"account",{
                    successful: false,
                    message: "Invalid current password"
                });
            }
        }
    });
});

app.post("/Account/GrantAdminPrivileges", validation.requireAdmin, function (req, res) {
    var response = new Object();
    var userName = req.body.NewAdminUserName;
    var groupId = null;
    credentialProvider.getUserByUserName(userName,function(result) {
        if(result.status === credentialProvider.Statuses.Error) {
            response.status="Error";
            response.message = "Invalid user";
            res.locals.messages.errors.push(response.message);
            responseEngine.render(res,"account",{
                successful: false,
                message: "User not found"
            });
        }
        else {
            credentialProvider.getAdminByUserName(userName,function(result) {
                if(result.status === credentialProvider.Statuses.Error || result.results.length < 1) {
                    credentialProvider.addAdminByUserName(userName,null,true,function() {
                        if(result.status === credentialProvider.Statuses.Error) {
                            response.status = "Error";
                            response.message = "Error on adding user to admins table";
                            res.locals.messages.errors.push(response.message);
                        }
                        else {
                            response.status = "Success";
                            response.message = userName + " added as admin";
                            res.locals.messages.success.push(response.message);
                        }

                        responseEngine.render(res,"account",{
                            successful: false,
                            message: response.message
                        });//res.json(response);
                    });
                }
                else if(result.firstResult && result.firstResult.Active == 0) {
                    credentialProvider.activateAdminByAdminId(result.firstResult.AdminId,function() {
                        if(result.status === credentialProvider.Statuses.Error) {
                            response.message = "Error reactivating " + userName + " as admin";
                            res.locals.messages.errors.push("Error giving " + userName + " admin privileges");

                            responseEngine.render(res,"account",{
                                successful: false,
                                message: "Error giving " + userName + " admin privileges"
                            });
                        }
                        else {
                            response.message = userName + " added as admin";
                            res.locals.messages.success.push(response.message);

                            responseEngine.render(res,"account",{
                                successful: true,
                                message: "Admin added"
                            });
                        }
                    });
                }
                else {
                    response.status = "Error";
                    response.message = "User is already an admin";
                    res.locals.messages.errors.push(response.message);
                    responseEngine.render(res,"account",{
                        successful: false,
                        message: response.message
                    });
                }
            });
        }
    })
});

app.post("/Account/RevokeMyAdminPrivileges", validation.requireAdmin, function (req, res) {
    var userId = req.userId;
    credentialProvider.deActivateAdminByUserId(userId,function(result) {
        if(result.status === credentialProvider.Statuses.Error) {
            res.locals.messages.errors.push("Error revoking your admin privileges");
        }
        else {
            res.locals.admin = false;
            res.locals.messages.success.push("Your admin privileges have been revoked");
        }
        res.render("account");
    });
});
