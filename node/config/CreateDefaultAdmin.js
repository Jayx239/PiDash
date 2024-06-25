'use strict';
const mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');

/* Salt hash logic taken from Validation.js */
function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
}

function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
}

function saltHashPassword(userpassword) {
    var salt = genRandomString(16);
    /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}

function rollback(sqlConn) {
    console.log("Error, rolling back");
    sqlConn.query("ROLLBACK;")
}

fs.readFile('./sql.config', function (err, contents) {
    if (err) {
        console.log("Error reading sql config file");
    }
    else {
        var sqlCreds = JSON.parse(contents);

        var sqlConn = mysql.createConnection({
            host: sqlCreds.host,
            user: sqlCreds.user,
            password: sqlCreds.password
        });

        sqlConn.connect(function (err) {
            if (err) {
                console.log("Error connection to db")
                process.exit(-1);
                return;
            }
			// Note: Should use sql formatter to prevent injection attacks
            sqlConn.query(`USE ${sqlCreds.database};`, function (err, result, fields) {
                sqlConn.beginTransaction(function (err) {
                    if (err) {
                        console.log("Error starting transaction");
                        sqlConn.rollback(function () {
                            process.exit(1);
                            return;
                        });
                    }

                    sqlConn.query("SELECT * FROM Users WHERE UserName='admin';", function (err, result, fields) {
                        if (err || result.length == 0) {
                            sqlConn.query("INSERT INTO Users(UserName,PrimaryEmail,FirstName,MiddleName,LastName,BirthDay,BirthMonth,BirthYear) VALUES('admin','admin@admin.com','admin','admin','admin',1,1,1990);", function (err, result, fields) {
                                if (err) {
                                    console.log(`Error adding user err: ${err}`);
                                    sqlConn.rollback(function () {
                                        process.exit(3);
                                    })
                                }
                                else {
                                    sqlConn.query("SELECT * FROM Users WHERE UserName='admin';", function (err, result, fields) {
                                        var userId = result[0].UserId;
                                        console.log(userId);
                                        if (err || result.length === 0) {
                                            console.log(`Error adding user, err: ${err}`);
                                            sqlConn.rollback(function () {
                                                process.exit(4);
                                            })
                                        }
                                        else {
                                            var saltHash = saltHashPassword("admin");
                                            sqlConn.query("INSERT INTO Credentials(UserId,Salt,Hash) Values(" + userId + ",'" + saltHash.salt + "','" + saltHash.passwordHash + "')", function (err, result, fields) {
                                                if (err) {
                                                    console.log("Error adding credentials for admin");
                                                    sqlConn.rollback(function () {
                                                        process.exit(5);
                                                    })
                                                }

                                                sqlConn.query("INSERT INTO Admins(UserId,GroupId,Active) Values(" + userId + ", 0, 1);", function (err, result, fields) {
                                                    if (err) {
                                                        console.log("Error adding user to admins table");
                                                        sqlConn.rollback(function () {
                                                            process.exit(6)
                                                        });
                                                    }
                                                    else {
                                                        console.log("Admin added");
                                                        sqlConn.commit(function () {
                                                            process.exit(0);
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            console.log("User admin already exists");
                            process.exit(2);
                        }

                    });
                });
            });
        });
    }
});
