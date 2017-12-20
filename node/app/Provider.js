const winston = require('./Logger');
const fs = require('fs');
var mysql = require('mysql');
var pool;
var logger = winston.logger;

var Statuses = {"Success": "success", "Error":"error"};

fs.readFile('./config/sql.config','utf-8', function(err,contents) {
    logger.info("Reading sql config file");
    if(err) {
        logger.error("Error opening database config file")
    }
    else{
        var poolConfig = JSON.parse(contents);

        pool = mysql.createPool(poolConfig);
        logger.info("Database connected");
    }
});

/* Function for running server commands */
var runCommand = function(sqlQuery,callback) {
    pool.getConnection(function(err,connection){
        if(err) {
            logger.error("Provider Error: Error opening connection");
            logger.log('debug',"Provider runCommand, Query: " + sqlQuery);
        }
        else {
            connection.query(sqlQuery,function(err,results,fields){
                if(err) {
                    logger.error("Provider Error: Error running command");
                    logger.log('debug',"Provider runCommand, Query: " + sqlQuery);
                    var returnObject = {"status":Statuses.Error,"message": "Error running command"};
                    return callBack(returnObject);
                }
                else {
                    var returnObject = {"status": Statuses.Success,"results":results,"fields":fields};
                    callback(returnObject);
                }
            });
        }
    });
};

/* Database get provider functions */
var getUserByUserName = function(userName, callback){
    var sqlQuery = "SELECT * FROM Users WHERE UserName='" + userName + "';";
    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

var getUserByUserId = function(userId, callback){
    var sqlQuery = "SELECT * FROM Users WHERE UserId=" + userId + ";";
    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

var getCredentialsByUserId = function(userId, callback){
    var sqlQuery = "SELECT * FROM Credentials WHERE UserId='" + userId + "';";
    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

var getCredentialsByUserName = function(userName, callback){
    var sqlQuery = "SELECT * FROM Users AS U " +
        "INNER JOIN Credentials AS C " +
        "ON U.UserId = C.UserId " +
        "WHERE U.UserName='" + userName + "';";

    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

var getGroupByGroupId = function(groupId, callback){
    var sqlQuery = "SELECT * FROM Groups WHERE GroupId='" + groupId + "';";
    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

var getAdminByUserId = function(userId,callback){
    var sqlQuery = "SELECT * FROM Admins WHERE UserId='" + userId + "';";
    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

var getAdminByUserName = function(userName,callback){
    var sqlQuery = "SELECT * FROM Users AS U " +
        "INNER JOIN Admins AS A " +
        "ON U.UserId = A.UserId " +
        "WHERE U.UserName='" + userName + "';";
    runCommand(sqlQuery,function(result){
        callback(result);
    });
};

/* Insert provider functions */
var addUserToUsersTable = function(userName, primaryEmail, firstName, middleName, lastName, birthDay, birthMonth, birthYear, callback) {
    getUserByUserName(userName,function(returnObject){
        if(returnObject.Status !== validation.Statuses.Error) {
                logger.log('debug',"Valid UserName");
                var sqlQuery = "INSERT INTO Users(UserName,PrimaryEmail,FirstName,MiddleName,LastName,BirthDay,BirthMonth,BirthYear) VALUES('" + userName + "','" + primaryEmail + "','" + firstName + "','" + middleName + "','" + lastName + "'," + birthDay + "," + birthMonth + "," + birthYear + ");";
                runCommand(sqlQuery,function(result){
                    callback(result);
            });
        }
        else {
            logger.log('debug', "Error adding user to Users table, UserName already exists");
            returnObject.message = "User name already exists";
            callback(returnObject);
        }
    });
};


/* Export */
module.exports = {
    Statuses : Statuses,
    getGroupByGroupId: getGroupByGroupId,
    getCredentialsByUserId: getCredentialsByUserId,
    getCredentialsByUserName : getCredentialsByUserName,
    getUserByUserId: getUserByUserId,
    getUserByUserName: getUserByUserName,
    getAdminByUserId: getAdminByUserId,
    getAdminByUserName: getAdminByUserName,
    addUserToUsersTable: addUserToUsersTable
};