import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import Image from "../../../assets/Spinner.gif";
import ModelFields from "../../../utils/enums";

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
        this.loadTableData()
        this.loadVendors()
    }

    loadTableData () {
        let {searchRequestFunction, parseSearchResultsFunction} = this.props
        let getModelsCallBack = (json) => {
            let data = parseSearchResultsFunction(json)
            this.setState({
                results : data
            })
        }
        searchRequestFunction(this.props.token,
            this.state.searchFieldValues,
            getModelsCallBack,
            (errorMessage) => alert(errorMessage))
    }

    loadVendors () {
        let getVendorsCallBack = (json) => {
            this.setState({vendors: json})
        }
        MiscellaneousRequests.getVendors(this.props.token, this.state.searchFieldValues[ModelFields.EquipmentModelFields.VENDOR], getVendorsCallBack)
    }

    /*
    Once search field values are updated, call this.loadTableData to update the table based on the search fields
     */

    updateSearchFieldValues = (searchFieldName, searchFieldValue) => {
        this.state.searchFieldValues[searchFieldName] = searchFieldValue
        this.setState({
            searchFieldValues : this.state.searchFieldValues,
        },
            this.loadTableData)
    }

    render() {
        let data = {
            columns: this.props.columns,
            rows: this.state.results
        }
        let Content = !this.state.results ?
        <div style={{display: 'flex', justifyContent: 'center', alignItems : 'center'}}>
            <img alt="loading"
                 style={{width: 150, marginTop: 50}}
                 src={Image}/>
        </div>
            :
        <MDBDataTable
            autoWidth={false}
            striped
            bordered
            small
            searching={false}
            data={data}
        />
        return (
            <div style={{background: "white"}}>
                <SearchHeader searchFields= {this.props.searchFields}
                              updateSearchFieldValues={this.updateSearchFieldValues}
                              token={this.props.token}
                              vendors={this.state.vendors}
                                />
                {this.props.children}
                {Content}
            </div>);
    }
}

InventoryTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    searchFields: PropTypes.object.isRequired, // the fields of the datatable that should be searchable
    token: PropTypes.string.isRequired, // the token obtained through login
    searchRequestFunction: PropTypes.func.isRequired,  // the request from the shared library used to populate the table
    parseSearchResultsFunction: PropTypes.func, // the parser used to format the data from the request so it can be added to the table
}

InventoryTable.defaultProps = {
    parseSearchResultsFunction: results => results,
}

export default InventoryTable;