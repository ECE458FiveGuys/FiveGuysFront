import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import Loading from "../Images/Loading";

export default class DataTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {columns, rows, searching, backendPagination, disableRetreatAfterSorting} = this.props
        let data = {
            columns: columns,
            rows: rows
        }
        return !rows ?
            (<Loading/>)
                :
                (<MDBDataTable
                    autoWidth={false}
                    hover
                    striped
                    bordered
                    small
                    searching={searching}
                    disableRetreatAfterSorting={disableRetreatAfterSorting}
                    data={data}
                />)
    }
}

DataTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    searching : PropTypes.bool,
    backendPaginated : PropTypes.bool,
    disableRetreatAfterSorting : PropTypes.bool
}

DataTable.defaultProps = {
    backendPaginated : false,
    disableRetreatAfterSorting : false
}
