import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import SearchBar from "../Widgets/SearchBar";
import Dropdown from "../Widgets/Dropdown";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";

class InventoryTable extends Component {

    constructor(props) {
        super(props)
        let searchFieldValues = {}
        Object.values(this.props.searchFields).forEach(value => {
            searchFieldValues[value] = ""
        })
        this.state = {
            results : [], //todo: get from db
            searchFieldValues : searchFieldValues
        }
        this.updateSearchFieldValues = this.updateSearchFieldValues.bind(this)
    }

    updateSearchFieldValues = (searchFieldName, searchFieldValue) => {
        this.state.searchFieldValues[searchFieldName] = searchFieldValue
        this.setState({
            searchFieldValues : this.state.searchFieldValues,
            results : []  //todo: filterResults
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
    columns: PropTypes.array,
    searchFields: PropTypes.object
}

export default InventoryTable;