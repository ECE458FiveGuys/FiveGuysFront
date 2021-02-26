import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import Image from "../../../../assets/Spinner.gif";
import ModelFields from "../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import DataTable from "../../../Common/Tables/DataTable";

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
        this.loadTableData = this.loadTableData.bind(this)
    }

    async componentDidMount() {
        this.loadTableData()
        this.loadVendors()
        this.loadCategories()
    }

    loadTableData = () => {
        let {searchRequestFunction, parseSearchResultsFunction, token} = this.props
        let getModelsCallBack = async (json) => {
            let parsedResults = parseSearchResultsFunction(json)
            this.setState({results: parsedResults})
        }
        searchRequestFunction(token,
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

    loadCategories () {
        let {token, searchFields} = this.props
        // categoryType = model_categories or instrument_categories
        let getCategoriesCallBack = (categoryType) => (json) => {
            let newState = {}
            let categories = []
            json.forEach(category => {
                categories.push(category[ModelFields.CategoryFields.NAME])
            })
            newState[categoryType] = categories
            this.setState(newState)
        }
        MiscellaneousRequests.getCategories(token,
            searchFields == EquipmentModel.SEARCH_FIELDS ? EquipmentModel.TYPE : Instrument.TYPE,
            getCategoriesCallBack)
    }

    /*
    Once search field values are updated, call this.loadTableData to update the table based on the search fields
     */

    updateSearchFieldValues = (searchFieldValues) => {
        this.setState({results : undefined },
            ()=> this.setState({searchFieldValues : searchFieldValues},
                this.loadTableData)
        )
    }

    render() {
        return (
            <div style={{background: "white"}}>
                <SearchHeader searchFields= {this.props.searchFields}
                              updateSearchFieldValues={this.updateSearchFieldValues}
                              token={this.props.token}
                              vendors={this.state.vendors}
                              modelCategories={this.state.model_categories ? this.state.model_categories : []}
                              instrumentCategories={this.state.instrument_categories ? this.state.instrument_categories : []}
                                />
                {this.props.children}
                <DataTable columns = {this.props.columns}
                           rows = {this.state.results}
                />
            </div>);
    }
}

InventoryTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    searchFields: PropTypes.object.isRequired, // the fields of the datatable that should be searchable
    token: PropTypes.string.isRequired, // the token obtained through login
    searchRequestFunction: PropTypes.func.isRequired,  // the request from the shared library used to populate the table
    categoriesName: PropTypes.string.isRequired,
    parseSearchResultsFunction: PropTypes.func, // the parser used to format the data from the request so it can be added to the table
}

InventoryTable.defaultProps = {
    parseSearchResultsFunction: results => results,
}

export default InventoryTable;