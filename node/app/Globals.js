module.exports = {
    useApiResponse: function(req) {
        if(req && req.headers && req.headers.origin == null) {
            return false;
        }
        return true;
    }
};
