/* ************************************************************************ */
/*
    Server API Routing -


    NOTE: The module arguments are required. And your code will use them to 
    access the Express application object, database object, and the root path 
    of the application.
*/
module.exports = function(app, db, approot) {

    var path = require('path');

    /* ******************************************************************** */
    /*
        GET /api/saved - searches the database for all records that are
        not marked for deletion (part of a future feature) and responds 
        to the client with what was found.
    */
    app.get('/api/saved', function(req, res) {
        console.log('get - /api/saved');
        // respond with all saved articles
        db.ArticleModel.find({'deleted': false})
        .exec(function (err, saved) {
            if(err) throw err;
            var list = JSON.parse(JSON.stringify(saved));
            res.json(list);
        });
    });

    /*
        POST /api/saved - 
    */
    app.post('/api/saved', function(req, res) {
        console.log('post - /api/saved');
        // use 'headline' and see if it's already
        // been saved, if so then do nothing.
        db.ArticleModel.findOne({'headline': req.body.headline})
        .exec(function (err, doc) {
            if(err) throw err;
            // doc will be null if not found
            if(!doc) {
                var tmp = new db.ArticleModel(req.body);
                tmp.save(function (err, doc) {
                    if(err) throw err;
                    broadcastArticles(res);
                });
            } else {
                broadcastArticles(res);
            }
        });
    });

    /*
        DELETE /api/saved:id - 
    */
    app.delete('/api/saved/:id', function(req, res) {
        console.log('delete - /api/saved');
        db.ArticleModel.findOneAndRemove({'_id' : req.params.id},
        function(err, result) {
            if(err) throw err;
            broadcastArticles(res);
        });
    });

    /* ******************************************************************** */
    /*
        Broadcast Articles - searches the database for all records that are
        not marked for deletion (part of a future feature) and broadcasts
        what it finds to all clients connected via socket.io, since the 
        article data is being broadcast we will "end" the request here.
    */
    function broadcastArticles(res) {
        db.ArticleModel.find({'deleted': false})
        .exec(function (err, saved) {
            if(err) throw err;
            var list = JSON.parse(JSON.stringify(saved));
            if(res !== undefined) res.end();
            app.get('socketio').sockets.emit('broadcast', list);
        });
    };
};
