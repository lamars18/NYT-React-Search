/* ************************************************************************ */
/*
    Issue Schema - The publication issue obtained from the scraped data                                   
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema= new Schema({
    headline: String,
    byline: String,
    sectionName: String,
    pubDate: String, 
    webURL: String,
    dateSaved: {type: Date, default: Date.now},
    deleted: {type: Boolean, default: false}
});

var ArticleModel = mongoose.model('Article',articleSchema);

module.exports=ArticleModel; 

