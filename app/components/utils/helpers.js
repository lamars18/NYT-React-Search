/* ************************************************************************ */
/*
    This helper provides the the function to send requests to NYT for 
    articles.
*/
var axios = require('axios');

// NYT authentication key
const authKey = 'a1eb7da15d9841e0bc2559a7c6fb17c3';

// Based on the queryTerm we will create a queryURL 
const queryURLBase = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=' + authKey + '&q=';

// where we save the articles returned in the NYT response
var itemList = [];

// Helper functions for making API Calls
var helper = {

    /*
        Makes the query to the NYT API for news articles.
    */
    runQuery: function(data) {
        // delete any results from the last search
        itemList.splice(0, itemList.length);

        // assemble the URL we'll need for our query...
// TODO: jmotyl - change this so that we're using this -
// axios.get(url,{api-key:????, q:data.searchTerm, ...})
        var queryURL = queryURLBase + data.searchTerm + '&begin_date=' + data.startDate + '&end_date=' + data.endDate;
        // make the query, wait for a response and return the data
        return axios.get(queryURL).then(function(respData) {
            // iterate through the response and only extract the
            // desired quantity of articles
            var limit = (respData.data.response.docs.length >  data.numItemsSelect) ? data.numItemsSelect : respData.data.response.docs.length;
            for(var idx=0; idx < limit; idx++) {
                // let's make this easier to read
                var article = respData.data.response.docs[idx];
                var item = Object.assign({}, 
                {
                    tagCounter: (idx + 1),
                    headline: (article.headline != 'null') ? article.headline.main : '',
                    byline: (article.byline && article.byline.hasOwnProperty('original')) ? article.byline.original : '',
                    sectionName: article.section_name,
                    pubDate: new Date(article.pub_date).toLocaleString(),
                    webURL: article.web_url
                });
                itemList.push(item);
            }
            return itemList;
        }).catch(function (error) {
            if(error) {
                console.log(error);
                throw error;
                return null;
            }
        });
    },

    /*
        The user has chosen to save an article.
    */
    saveArticle: function(data) {
        return axios.post('/api/saved', data)
        .then(function(respData) {
            // NOTE: We are using socket.io to broadcast data
            // to any clients who are connected to the server.
            // So that means that any action that causes a 
            // potential change in the database (on the server)
            // will result in a broadcast of the data. And the
            // server will close the response to our POST and
            // DELETE requests.
            return (''+ respData.status + ' ' + respData.text);
        })
        .catch(function (error) {
            if(error) {
                console.log(error);
                throw error;
                return null;
            }
        });
    },

    /*
        Get all saved articles
    */
    getArticles: function() {
        return axios.get('/api/saved')
        .then(function(respData) {
            return respData.data;
        })
        .catch(function (error) {
            if(error) {
                console.log(error);
                throw error;
                return null;
            }
        });
    },

    /*
        Delete a saved article
    */
    delArticle: function(data) {
        return axios.delete('/api/saved/'+data._id)
        .then(function(respData) {
            return (''+ respData.status + ' ' + respData.text);
        })
        .catch(function (error) {
            if(error) {
                console.log(error);
                throw error;
                return null;
            }
        });
    }
};

// We export the API helper
module.exports = helper;
