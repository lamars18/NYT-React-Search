/* ************************************************************************ */
/*
    Database Connection and Model Management - Scalable Version                                  


    Mongoose Setup

    Based on our run-time environment choose the appropriate 
    parameters for connecting to the database
*/
var env = process.env.NODE_ENV || 'development';
var config = require('../mongo-config.json')[env];
// 
var mongodbURI = process.env.MONGODB_URI || config.MONGODB_URI;

var mongoose = require('mongoose');
var Promise = require("bluebird");

// satisfy the Mongoose deprecation warning
mongoose.Promise = Promise;

var db = {};

// The models... (add/remove as needed)
db.ArticleModel = require('./article.js');

// These are nice to have available elsewhere
db.mongoose = mongoose;
db.conn = mongoose.connection;

mongoose.connect(mongodbURI, function(err, data){
	if(err)
	    console.log(err);
	else{
	    console.log("connection success");
	    db.connflag = true;
	}  
});

db.conn.on("error", function(error) {
    console.log("Mongoose Error: ", error);
    throw error;
});


module.exports = db;
