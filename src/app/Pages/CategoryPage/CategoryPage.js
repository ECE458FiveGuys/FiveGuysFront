import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import Image from "../../../../assets/Spinner.gif";
import ModelFields from "../../../../utils/enums";
import {Models} from "../../../utils/ModelEnums";
import TableColumns from "../MainPage/InventoryTables/Columns";

export default class CategoryPage extends Component {

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
        let data = {
            columns: TableColumns.CATEGORY_COLUMNS,
            rows: this.state.results
        }
        let Content = !this.state.results ?
            <div style={{display: 'flex', justifyContent: 'center', alignItems : 'center'}}>
                <img alt="loading"
                     style={{width: 100, marginTop: 50}}
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
                              modelCategories={this.state.model_categories ? this.state.model_categories : []}
                              instrumentCategories={this.state.instrument_categories ? this.state.instrument_categories : []}
                />
                {this.props.children}
                {Content}
            </div>);
    }
}

CategoryPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    modelType : PropTypes.string.isRequired
}

