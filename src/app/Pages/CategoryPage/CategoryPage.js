import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import DatatableEditable from "../../Common/Tables/DatatableEditable";
import DataTable from "../../Common/Tables/DataTable";
import ModelFields from "../../../utils/enums";
import Loading from "../../Common/Images/Loading";
import CategoryRequests from "../../../controller/requests/category_requests";
import ModelRequests from "../../../controller/requests/model_requests";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import {User} from "../../../utils/dtos";
import UpdateModel from "../../Common/Forms/UpdateModel";
import UpdateInstrument from "../../Common/Forms/UpdateInstrument";
import {EquipmentModel} from "../../../utils/ModelEnums";
import {SHORTEN_LABELS} from "../CreateFunctions/CreateUser";

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

    renderEditableDataTable = () => {
        let isModel = this.props.modelType == ModelFields.ModelTypes.EQUIPMENT_MODEL
        return (
            <DatatableEditable  token={this.props.token}
                                user={this.props.user}
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
    )
    }

    renderDataTable = () => {
        let isModel = this.props.modelType == ModelFields.ModelTypes.EQUIPMENT_MODEL
        return (
            <DataTable  token={this.props.token}
                                user={this.props.user}
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
        )}

    render() {
        let isModel = this.props.modelType == ModelFields.ModelTypes.EQUIPMENT_MODEL
        let {user} = this.props
        return (!this.state.model_categories && !this.state.instrument_categories) ?
        <Loading/>
        :
            <h4>
            {this.props.user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && this.renderEditableDataTable()}
            {!this.props.user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && this.renderDataTable()}
            </h4>
    }
}

CategoryPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired,
    modelType : PropTypes.string.isRequired,
    categoryType : PropTypes.string.isRequired
}

