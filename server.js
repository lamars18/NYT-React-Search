/* ************************************************************************ */
/*
    Node/Express Server
*/
var express = require('express');
var app = express();

/*
    Body Parser - provides json-ized form data
*/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/*
    Allow CORS

    See - http://enable-cors.org/server_expressjs.html
*/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/*
    NOTE: The following line is necessary, especially if 
    deploying to Heroku. Other platforms may require it
    as well. 
*/
app.set('port', (process.env.PORT || 3000));

var server;

/*
    Set up the database with our models
*/
var db = require('./models');

/*  
    After the database is opened listen on the 
    port that was configured for us
*/
db.conn.once('open', function() {
    // set up routes
    var router = require('./router');
    router(app, db, __dirname);

    // go!
    server = app.listen(app.get('port'), function () {
        console.log('Server - listening on port '+app.get('port'));
        console.log('Server - IDLE - waiting for the first connection');
        console.log('================================================');
        // listen for a socket.io connection and set up
        // the socket events that we're interested in.
        const io = require('socket.io').listen(server);
        // make available to any module that already has access to `app`
        app.set('socketio', io);
        var socketEvents = require('./appsocket.js');
        socketEvents(io);
        console.log('Server - IDLE - listening for socket.io events');
        console.log('================================================');
    });
});




