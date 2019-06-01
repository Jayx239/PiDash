const Globals = require('./Globals');
module.exports = {
    redirect: function render(res,viewName,apiResponseObject) {
        if(Globals.useApiResponse) {
            res.send(apiResponseObject);
        }
        else {
            res.redirect(viewName);
        }
    },
    render: function render(res,viewName,apiResponseObject) {
        if(Globals.useApiResponse) {
            res.send(apiResponseObject);
        }
        else {
            res.render(viewName)
        }
    }
};