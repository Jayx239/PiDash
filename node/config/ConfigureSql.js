/* Program for initializing the PiDash database
* Depends on sql.config for mysql configuration, Run 'make configurator' to generate the config file.
* */

const mysql = require('mysql');
const fs = require('fs');

fs.readFile('./sql.config',function(err,contents) {
    if(err) {
        console.log("Error reading sql config file");
    }
    else {
        var sqlCreds = JSON.parse(contents);

        var sqlConn = mysql.createConnection({
            host: sqlCreds.host,
            user: sqlCreds.user,
            password: sqlCreds.password
        });

        sqlConn.connect();
        createDatabase(sqlConn, function() {
	       sqlConn.query("USE " + sqlCreds.database + ";",function(err,result,fields){	
                  if(err){
		     console.log("Error using database");
		  }
	          createUsersTable(sqlConn,function(sqlConn){
                     createCredentialsTable(sqlConn,function(sqlConn){
		  
                        createGroupsTable(sqlConn,function(sqlConn){
			   createAdminsTable(sqlConn,function(sqlConn){})
			      console.log("----------- Database Setup Complete -----------");
			   });
		     });
		  })
           });
	});
    }
});

var createDatabase = function(sqlConn, callback) {
    var query = "CREATE DATABASE PiDash";
    sqlConn.query(query,function(err,result,fields){
        if(err) {
            console.log("Error creating PiDash Database");
        }
        else{
            console.log("Success: PiDash Database created");
        }
	    if(callback)
		    callback();
    })
};

var createUsersTable  = function(sqlConn, callback) {
    var query = "CREATE TABLE Users(" +
        "CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "UserId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "UserName VARCHAR(36), " +
        "PrimaryEmail VARCHAR(254), " +
        "FirstName VARCHAR(36) NOT NULL, " +
        "MiddleName VARCHAR(36), " +
        "LastName VARCHAR(36), " +
        "BirthDay INT CHECK(BirthDay > 0 AND BirthDay <= 31), " +
        "BirthMonth INT CHECK(BirthMonth > 0 AND BirthMonth <=12), " +
        "BirthYear INT);";

    sqlConn.query(query,function(err,result,fields){
        if(err) {
            console.log("Error creating Users table");
        }
        else{
            console.log("Success: Users table created");
	}
	if(callback)
	   callback(sqlConn);
    })
};


var createCredentialsTable = function(sqlConn, callback) {
    var query = "CREATE TABLE Credentials(" +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "UserId INT NOT NULL, " +
        "Salt CHAR(16) NOT NULL, " +
        "Hash CHAR(128) NOT NULL);";
    sqlConn.query(query,function(err,result,fields){
        if(err) {
            console.log("Error creating Credentials table");
        }
        else{
            console.log("Success: Credentials table created");
        }
	   if(callback)
	      callback(sqlConn);

    });
};

var createGroupsTable = function(sqlConn, callback) {
    var query = "CREATE Table Groups(" +
        "CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "GroupId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "CreatorUserId INT NOT NULL, " +
        "GroupName VARCHAR(36));" ;
    sqlConn.query(query,function(err,result,fields){
        if(err) {
            console.log("Error creating Groups table");
        }
        else{
            console.log("Success: Groups table created");
        }
    
	if(callback)
	   callback(sqlConn);
    });
};
var createAdminsTable = function(sqlConn, callback) {
    var query = "CREATE TABLE Admins(" +
        "AdminId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "UserId INT NOT NULL, " +
        "LastUpdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP, " +
        "GroupId INT NOT NULL, " +
        "Active bool);";
    sqlConn.query(query,function(err,result,fields){
        if(err) {
            console.log("Error creating Admins table");
        }
        else{
            console.log("Success: Admins table created");
        }
	if(callback)
	   callback(sqlConn);

    });
};

module.exports = {
    createDatabase: createDatabase,
    createAdminsTable: createAdminsTable,
    createGroupsTable: createGroupsTable,
    createCredentialsTable: createCredentialsTable,
    createUsersTable: createUsersTable
};
