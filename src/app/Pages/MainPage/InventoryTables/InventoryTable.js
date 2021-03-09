import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import ModelFields from "../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import DataTable from "../../../Common/Tables/DataTable";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import HTPButton from "../../../Common/HTPButton";
import Image from "../../../../assets/hpt_logo.png"
import BackendPaginatedDataTable from "../../../Common/Tables/BackendPaginatedDataTable";
import ActionHeader from "../Widgets/ActionHeader";
import {User} from "../../../../utils/dtos";
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
        this.tableRef = React.createRef()
    }

    async componentDidMount() {
        this.loadVendors()
        this.loadCategories()
    }

    loadVendors () {
        let getVendorsCallBack = (json) => {
            this.setState({vendors: json})
        }
        MiscellaneousRequests.getVendors(this.props.token, undefined, getVendorsCallBack)
    }

    loadCategories () {
        let {token, searchFields} = this.props
        // categoryType = model_categories or instrument_categories
        let getCategoriesCallBack = (categoryType) => (json) => {
            let categories = json.map(category => {
                return category[ModelFields.CategoryFields.NAME]
            })
            this.setState({[categoryType] : categories})
        }
        MiscellaneousRequests.getCategories(token,
            searchFields == EquipmentModel.SEARCH_FIELDS ? EquipmentModel.TYPE : Instrument.TYPE,
            getCategoriesCallBack)
    }

    /*
    Once search field values are updated, call this.loadTableData to update the table based on the search fields
     */

    updateSearchFieldValues = (searchFieldValues) => {
        this.setState({searchFieldValues : searchFieldValues},
            this.tableRef.current.forceSearch
        )
    }

    updatePageState = (state) => {
        this.setState(state)
    }

    render() {
        let {searchRequestFunction, parseSearchResultsFunction, token, columns, searchFields, user, history} = this.props
        let {searchFieldValues} = this.state
        return (
            <div>
                <ActionHeader searchFields={searchFields}
                              updateSearchFieldValues={this.updateSearchFieldValues}
                              token={token}
                              vendors={this.state.vendors}
                              modelCategories={this.state.model_categories ? this.state.model_categories : []}
                              instrumentCategories={this.state.instrument_categories ? this.state.instrument_categories : []}
                              updatePageState={this.updatePageState}
                              user={user}
                              history={history}
                                />
                {this.props.children}
                <BackendPaginatedDataTable columns={columns}
                                           dataFetchFunction={searchRequestFunction}
                                           dataFetchFunctionParser={parseSearchResultsFunction}
                                           searchParams={searchFieldValues}
                                           token={token}
                                           ref={this.tableRef}
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
    user: PropTypes.instanceOf(User),
    history: PropTypes.object.isRequired
}

InventoryTable.defaultProps = {
    parseSearchResultsFunction: results => results,
}

export default InventoryTable;