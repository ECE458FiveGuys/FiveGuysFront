import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import DatatableEditable from "../../Common/Tables/DatatableEditable";
import ModelFields from "../../../utils/enums";
import Loading from "../../Common/Images/Loading";
import CategoryRequests from "../../../controller/requests/category_requests";
import ModelRequests from "../../../controller/requests/model_requests";
import InstrumentRequests from "../../../controller/requests/instrument_requests";

export default class CategoryPage extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.updateSearchFieldValues = this.updateSearchFieldValues.bind(this)
    }

    async componentDidMount() {
        this.loadCategories()
    }

    loadCategories () {
        let {token, modelType} = this.props
        // categoryType = model_categories or instrument_categories
        let getCategoriesCallBack = (categoryType) => (json) => {
            let newState = {}
            newState[categoryType] = json
            this.setState(newState)
        }
        MiscellaneousRequests.getCategories(token, modelType, getCategoriesCallBack, ()=>{}, true)
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
        let isModel = this.props.modelType == ModelFields.ModelTypes.EQUIPMENT_MODEL
        return (!this.state.model_categories && !this.state.instrument_categories) ?
        <Loading/>
        :
            <div style={{background: "white"}}>
                <DatatableEditable  token={this.props.token}
                                    columns={this.props.columns}
                                    tableName={"Categories"}
                                    rows={isModel ?
                                        this.state.model_categories : this.state.instrument_categories}
                                    editableColumns={this.props.columns}
                                    createFunction={isModel ? CategoryRequests.createModelCategory : CategoryRequests.createInstrumentCategory}
                                    editFunction={isModel ? CategoryRequests.editModelCategory : CategoryRequests.editInstrumentCategory}
                                    deleteFunction={isModel ? CategoryRequests.deleteModelCategory : CategoryRequests.deleteInstrumentCategory}
                                    validateDeleteFunction={isModel ? ModelRequests.getModelsByCategory : InstrumentRequests.getInstrumentsByCategory}
                                    />
            </div>
    }
}

CategoryPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    modelType : PropTypes.string.isRequired,
    categoryType : PropTypes.string.isRequired
}

