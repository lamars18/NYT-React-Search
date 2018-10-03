/* ************************************************************************ */
/*
    This portion is the form and the child that contains the search results.
*/
var React = require('react');

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// this component's children
var Result = require('./result.js');
var Saved = require('./saved.js');

// only 3 choices, NYT seems to return a max of 10
var ITEMQTYCHOICES = ['1', '5', '10'];

// Row 1 - 
//      Col 1 - Search term[label & input]
var R1C1_SIZES = "col-lg-6 col-md-6 col-sm-6 col-xs-8";
//      Col 2 - Number of Items to...
var R1C2_SIZES = "col-lg-6 col-md-6 col-sm-6 col-xs-4";
//          Row 1 - label
var R1C2_LABEL_SIZES = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
//          Row 2 - select 
var R1C2_INPUT_SIZES = "col-lg-2 col-md-3 col-sm-3 col-xs-5";
// Row 2 - 
//      Col 1 - Start Date picker
var R2C1_SIZES = "col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3 col-sm-offset-2 col-sm-4 col-xs-offset-2 col-xs-4";
//      Col 2 - End Date picker
var R2C2_SIZES = "col-lg-3 col-md-3 col-sm-4 col-xs-4";
// Row 3 - 
//      Col 1 - Search button
var R3C1_SIZES = "col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3 col-sm-offset-2 col-sm-4 col-xs-offset-2 col-xs-4";
//      Col 2 - Clear button
var R3C2_SIZES = "col-lg-3 col-md-3 col-sm-4 col-xs-4";

var Search = React.createClass({

    getInitialState: function() {
        console.log('SEARCH - getInitialState');
        return {errors: {}, submitted: null, items: []}
    },

    isValid: function() {

        // the form fields we will validate
        var fields = ['searchTerm', 'numItemsSelect', 'startDate', 'endDate']

        var errors = {}
        fields.forEach(function(field) {
            var value = this.refs[field].value.replace(/^\s+|\s+$/g, '')
            if(!value) {
                errors[field] = 'This field is required'
            }
        }.bind(this))

        this.setState({errors: errors})

        // set it now, the test will reset it if necessary
        var isValid = true

        // if any errors were detected and saved then reset
        // the valid flag to false and stop checking errors
        for (var error in errors) {
            isValid = false
            console.log(errors)
            break
        }
        return isValid
    },

    getFormData: function() {
        var data = {
            searchTerm: this.refs.searchTerm.value,
            numItemsSelect: this.refs.numItemsSelect.value,
            startDate: this.refs.startDate.value.replace(/-/g, ''),
            endDate: this.refs.endDate.value.replace(/-/g, '')
        }
        return data
    },
    
    getToday: function() {
        var today = new Date()
        var zeropadM = ''
        var zeropadD = ''
        if((today.getMonth() + 1) < 10) zeropadM = '0'
        if(today.getDate() < 10) zeropadD = '0'
        var defdate = '' + today.getFullYear() + '-' + zeropadM + (today.getMonth() + 1) + '-' + zeropadD + today.getDate()
        return defdate
    },

    handleSubmit: function() {
        if(this.isValid()) {
            helpers.runQuery(this.getFormData())
            .then(function(data) {
                console.log('got stuff????')
                console.log(data.length)
                var items = JSON.parse(JSON.stringify(data))
                this.setState({items: data, count: items.length});
            }.bind(this));
        } else {
            console.log('oops!')
            console.log(this.state.errors)
            console.log(this.props.errors)
        }
    },

    handleClear: function() {
        this.refs.searchTerm.value = ''
        this.refs.numItemsSelect.value = ITEMQTYCHOICES[0]
        this.refs.startDate.value = ''
        
        this.refs.endDate.value = this.getToday()
        console.log('clearing state.....')
        this.setState({submitted: null, items: [], count: 0})
    },

    componentWillReceiveProps: function(nextProps) {
        console.log('SEARCH - componentWillReceiveProps')
    },

    render: function() {
        return(
        <div>
            <div className="row">
                <div className="col-sm-12">
                <br />
                    <div className="panel panel-danger">
                        <div className="panel-heading">
                            <h3 className="panel-title"><strong><i className="fa fa-list-alt"></i>    Search Parameters</strong></h3>
                        </div>
                        <div className="panel-body">
                            <form role="form">
                                <div className="row">
                                    <div className={R1C1_SIZES}>
                                        {this.renderTextInput('searchTerm', 'Search Term:')}
                                    </div>
                                    <div className={R1C2_SIZES}>
                                        <div className='form-group'>
                                            <div className="row">
                                                <div className={R1C2_LABEL_SIZES}>
                                                    <label htmlFor='numItemsSelect'>Number of Items to Retrieve:</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={R1C2_INPUT_SIZES}>
                                                    {this.renderSelectOnly('numItemsSelect', ITEMQTYCHOICES)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                                 <div className="row">
                                    <div className={R2C1_SIZES}>
                                        {this.renderDateInput('startDate', 'Start Date :')}
                                    </div>
                                    <div className={R2C2_SIZES}>
                                        {this.renderDateInput('endDate', 'End Date :')}
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className={R3C1_SIZES}>
                                        <button type="button" className="btn btn-success" id="runSearch" onClick={this.handleSubmit}><i className="fa fa-search"></i> Search</button>
                                    </div>
                                    <div className={R3C2_SIZES}>
                                        <button type="button" className="btn btn-warning" id="clearAll" onClick={this.handleClear}><i className="fa fa-trash"></i> Clear Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Result items={this.state.items} count={this.state.count}/>
            <Saved />
        </div>
        )
    },

    renderTextInput: function(id, label) {
        return this.renderField(id, label,
            <input type="text" className="form-control" id={id} ref={id}/>
        )
    },

    renderDateInput: function(id, label) {
        var defdate = this.getToday()

        if(id === 'endDate') {
            return this.renderField(id, label,
                <input type="date" className="form-control" id={id} ref={id} defaultValue={defdate} max={defdate}/>
            )
        } else {
            return this.renderField(id, label,
                <input type="date" className="form-control" id={id} ref={id} max={defdate}/>
            )
        }
    },

    renderSelectOnly: function(id, values) {
        var options = values.map(function(value) {
            return <option key={value} value={value}>{value}</option>
        })
        return (
            <select className="form-control" id={id} ref={id}>
                {options}
            </select>
        )
    },

    renderSelect: function(id, label, values) {
        var options = values.map(function(value) {
            return <option key={value} value={value}>{value}</option>
        })
        return this.renderField(id, label,
            <select className="form-control" id={id} ref={id}>
                {options}
            </select>
        )
    },

    renderField: function(id, label, field) {
        return (
            <div className='form-group'>
                <label htmlFor={id}>{label}</label>
                {field}
            </div>
        )
    }
});

module.exports = Search;

