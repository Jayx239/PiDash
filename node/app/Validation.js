'use strict';
const crypto = require('crypto');
const winston = require('./Logger');
const server = require('./Server');

var logger = winston.logger;
var app = server.app;
var sessionTimeout = 30*60*1000;    /* Default to 30 minutes */
var session = require('express-session');
var helmet = require('helmet');

var invalidRedirectPath = "/";

app.use(helmet());

app.use(session({
    cookieName: 'session',
    secret: getRandomString(32),
    sessionId: saltHashPassword(getRandomString(16)),
    duration: sessionTimeout,
    user: "",
    admin: ""
}));

function logSession(sessionId, message, logType){
    message = "[SessionId: " + sessionId + "] - " + message;
    if(logType)
        logger.log(logType,message);
    else
        logger.info(message);
}

function validateUser(req, res, next){

}

function requireLogon(req,res,next) {
    if(!req.user)
        res.redirect(invalidRedirectPath);
    else
        next();
}

function requireAdmin(req,res,next) {
    requireLogon(req,res,function() {
        logSession(req.sessionID,"Admin validation required", 'debug');
        if(req.admin) {
            logSession(req.sessionID,"Admin validation successful", 'debug');
            next();
        }
        else {
            logSession((req.sessionID, "Admin validation failed"), 'debug');
            res.redirect(invalidRedirectPath);
        }
    });
}

/* https://github.com/SpaceG/salt-hash-password */
/**
 *  * generates random string of characters i.e salt
 *   * @function
 *    * @param {number} length - Length of the random string.
 *     */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 *  * hash password with sha512.
 *   * @function
 *    * @param {string} password - List of required fields.
 *     * @param {string} salt - Data to be validated.
 *      */
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
}

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}


module.exports = {
    logSession : logSession,
    validateUser : validateUser,
    requireLogon : requireLogon,
    requireAdmin : requireAdmin,
    genRandomString : getRandomString,
    sha512 : sha512,
    getRandomString : getRandomString,
    saltHashPassword : saltHashPassword
}