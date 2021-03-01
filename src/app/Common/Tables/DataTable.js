import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import Loading from "../Images/Loading";

export default class DataTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let data = {
            columns: this.props.columns,
            rows: this.props.rows
        }
        return !this.props.rows ?
            (<Loading/>)
            :
            (<MDBDataTable
                autoWidth={false}
                hover
                striped
                bordered
                small
                searching={this.props.searching}
                data={data}
            />)
    }
}

DataTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    searching : PropTypes.bool
}
