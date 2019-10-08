const fs = require('fs');

var sessionConfigString = fs.readFileSync('./config/session.config','utf8');
var sessionConfig = JSON.parse(sessionConfigString);

module.exports = {
    useApiResponse: function(req) {
        if(req && req.headers && req.headers.origin == null) {
            return false;
        }
        return true;
    },
    sessionConfig: sessionConfig
};
