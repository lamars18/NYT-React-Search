/* ************************************************************************ */
/*
    All HTML-esque Content

    NOTE: The module arguments are required. And your code will use them to 
    access the Express application object, database object, and the root path 
    of the application.
*/
module.exports = function(app, db, approot) {
    var path = require('path');
    /*
        GET /index - responds with the index/landing page
    */
    app.get('/index', function(req, res) {
        res.sendFile(path.join(approot, '/public/index.html'));
    });
};

