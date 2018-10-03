/* ************************************************************************ */
/*
    This portion is a child of the search component. It renders the search 
    results.
*/
var React = require('react');

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

var Result = React.createClass({

    getInitialState: function() {
        console.log('RESULT - getInitialState');
        return {items: [], count: null}
    },

    componentWillReceiveProps: function(nextProps) {
        console.log('RESULT - componentWillReceiveProps')
        if(nextProps.count === 0) this.clearArticles()
    },

    render: function() {
        return(
            <div className="row">
                <div className="col-sm-12">
                    <br />
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title"><strong><i className="fa fa-table"></i>    Top Articles</strong></h3>
                        </div>
                        {this.renderArticles(this.props.items, this.props.count)}
                    </div>
                </div>
            </div>
        )
    },

    handleSave: function(article, e) {
        helpers.saveArticle(article)
    },

    renderArticles: function(items, count) {
        var articles = items.map(function(article) {
            var id = 'articleWell-' + article.tagCounter
            var numberStyle = {margin: "5px"};
            return (
                <div className="well" id={id} key={article.tagCounter}>
                    <h3><span className="label label-info" style={numberStyle}>{article.tagCounter}</span><strong>{article.headline}</strong></h3>
                    <br />
                    <h5>{article.byline}</h5>
                    <h5>{article.sectionName}</h5>
                    <h5>{article.pubDate}</h5>
                    <a target="_blank" href={article.webURL}>{article.webURL}</a>
                    <br />
                    <br />
                    <form role="form">
                        <button type="button" className="btn btn-success" id="runSave" onClick={this.handleSave.bind(this, article)}>Save</button>
                    </form>
                </div>
            )
        }.bind(this));
        return (
            <div className="panel-body" id="wellSection">
                {articles}
            </div>
        )
    },

    clearArticles: function() {
        return(
            <div className="row">
                <div className="col-sm-12">
                    <br />
                    <div className="panel panel-danger">
                        <div className="panel-heading">
                            <h3 className="panel-title"><strong><i className="fa fa-table"></i>    Top Articles</strong></h3>
                        </div>
                        <div className="panel-body" id="wellSection">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Result;

