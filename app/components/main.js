/* ************************************************************************ */
/*
    This portion wraps the form and its children (result.js)
*/
var React = require('react');

// the search component, contains the form and it's children
var Search = require('./search.js');

var Main = React.createClass({
    render: function render() {
        var jumboStyle = {backgroundColor: "#20315A", color: "white", marginTop: "10px"};
        var linkStyle = {fontSize: "small"}
        return(
            <div>
                <div className="jumbotron" style={jumboStyle}>
                    <h2 className="text-center"><strong><i className="fa fa-newspaper-o"></i>    New York Times Search</strong></h2>
                </div>
                <div className="text-center">
                    <h4>Enter Your Search Term to Search for an Article Below</h4>
                    <a className="btn btn-link" style={linkStyle} target="_blank" href="https://github.com/lamars18/NYT-React-Search">Github Repository</a>
                </div>
                <Search />
            </div>
        );
    }
});

module.exports = Main;
