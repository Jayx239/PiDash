var winston = require('./Logger');
var logger = winston.logger;
var server = require('./Server');
var app = server.app;
var provider = require('./Provider');
var validation = require('./Validation');

app.get("/Account", validation.requireLogon, function (req, res) {
    res.render("account");
});

app.post("/Account/ChangePassword", validation.requireLogon, function (req, res) {
    if (!validation.validPassword(req.body.OldPassword) || !validation.validPassword(req.body.NewPassword) || req.body.NewPassword !== req.body.RepeatNewPassword) {
        res.redirect("/Account");
        return;
    }
    provider.getCredentialsByUserName(req.user, function (returnObject) {
        if (returnObject.status === provider.Statuses.Error || returnObject.results.length < 1) {
            logger.error("Error changing password, user not found, UserName: " + req.user);
            res.locals.messages.errors.push("User not found");
            res.redirect("/Account");
        }
        else {
            if (validation.validateUserPassword(req.body.OldPassword, returnObject.results[0].Hash, returnObject.results[0].Salt)) {
                var saltHash = validation.saltHashPassword(req.body.NewPassword);
                provider.updateCredentialsByUserName(req.user, saltHash.passwordHash, saltHash.salt, function (result) {
                    if (result.status === provider.Statuses.Error) {
                        logger.error("Error updating User password, UserName: " + req.user);
                        res.locals.messages.errors.push("Error resetting password");
                        res.redirect("/Account");
                    }
                    else if (result.status === provider.Statuses.Success) {
                        logger.info("User password updated, UserName: " + req.user);
                        res.locals.messages.success.push("Password reset successfully")
                        res.redirect("/Account");
                    }
                    else {
                        res.redirect("/Account");
                    }
                });
            }
            else{
                res.redirect("/Account");
            }
        }
    });
});