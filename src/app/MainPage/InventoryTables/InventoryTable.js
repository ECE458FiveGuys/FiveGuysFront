import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";

class InventoryTable extends Component {

    constructor(props) {
        super(props)
        let searchFieldValues = {}
        Object.values(this.props.searchFields).forEach(value => {
            searchFieldValues[value] = ""
        })
        this.state = {
            searchFieldValues : searchFieldValues
        }
        this.updateSearchFieldValues = this.updateSearchFieldValues.bind(this)
    }

    async componentDidMount() {
        let {searchRequestFunction, parseSearchResultsFunction} = this.props
        let initial_data = parseSearchResultsFunction(await searchRequestFunction(this.props.token, {}))
        let vendors = await MiscellaneousRequests.get_vendors(this.props.token)
        this.setState({results: initial_data, vendors: vendors})
    }

    updateSearchFieldValues = async (searchFieldName, searchFieldValue) => {
        let {searchRequestFunction, parseSearchResultsFunction} = this.props
        this.state.searchFieldValues[searchFieldName] = searchFieldValue
        let search = await searchRequestFunction(this.props.token, this.state.searchFieldValues)
        let data = parseSearchResultsFunction(search)
        this.setState({
            searchFieldValues : this.state.searchFieldValues,
            results : data
        })
    }

    render() {
        let data = {
            columns: this.props.columns,
            rows: this.state.results
        }
        return (
            <div style={{background: "white", padding: 30}}>
                <SearchHeader searchFields= {this.props.searchFields}
                              updateSearchFieldValues={this.updateSearchFieldValues}
                              token={this.props.token}
                              vendors={this.state.vendors}
                                />
                <MDBDataTable
                        autoWidth={false}
                        striped
                        bordered
                        small
                        searching={false}
                        data={data}
                    />
            </div>);
    }
}

InventoryTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    searchFields: PropTypes.object.isRequired, // the fields of the datatable that should be searchable
    token: PropTypes.string.isRequired, // the token obtained through login
    searchRequestFunction: PropTypes.func.isRequired,  // the request from the shared library used to populate the table
    parseSearchResultsFunction: PropTypes.func // the parser used to format the data from the request so it can be added to the table
}

InventoryTable.defaultProps = {
    parseSearchResultsFunction: results => results
}

export default InventoryTable;