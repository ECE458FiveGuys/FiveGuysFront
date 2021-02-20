import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import SearchBar from "../Widgets/SearchBar";
import Dropdown from "../Widgets/Dropdown";
import PropTypes from "prop-types";

class InventoryTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            results : [], //todo: get from db
            searchValue : "",
            searchField : null,
            searchBy : "pk"
        }
        this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this)
        this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    }

    handleSearchValueChange = (searchValue) => {
        this.setState({
            searchValue : searchValue,
            results : []  //todo: filterResults
        })
    }

    handleSearchFieldChange = (searchField) => {
        this.setState({
            searchField : searchField,
            results : []  //todo: filterResults
        })
    }

    render() {
        let data = {
            columns: this.props.columns,
            rows: this.state.results
        }
        let {searchValue, searchField} = this.state
        return (
            <div>
                <SearchBar
                    setSearchValue={this.handleSearchFieldChange}
                    searchValue={searchValue}
                />
                <Dropdown updateSearchField={this.handleSearchValueChange}></Dropdown>
                <MDBDataTable
                        autoWidth={false}
                        striped
                        bordered
                        small
                        data={data}
                    />
            </div>);
    }
}

InventoryTable.propTypes = {
    columns: PropTypes.array
}

export default InventoryTable;