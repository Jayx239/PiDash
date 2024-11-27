const fs = require('fs');
const url = require('url');

var sessionConfigString = fs.readFileSync('./config/session.config', 'utf8');
var sessionConfig = JSON.parse(sessionConfigString);

module.exports = {
    useApiResponse: function (req) {
        const refererString = req?.headers?.referer;
        if (refererString) {
            const refererUrl = url.parse(refererString);
            if (refererUrl.pathname.startsWith('/v2/')) {
                return true;
            }
        }

        return false;
    },
    sessionConfig: sessionConfig
};
