import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import DatatableSelectable from "../../Common/Tables/DatatableEditable";
import ModelFields from "../../../utils/enums";

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
        MiscellaneousRequests.getCategories(token, modelType, getCategoriesCallBack)
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
                <DatatableSelectable columns={this.props.columns}
                                    rows={this.props.modelType == ModelFields.ModelTypes.EQUIPMENT_MODEL ?
                                        this.state.model_categories : this.state.instrument_categories}/>
            </div>);
    }
}

CategoryPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    modelType : PropTypes.string.isRequired,
    categoryType : PropTypes.string.isRequired
}

