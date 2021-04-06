import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import Loading from "../Images/Loading";

export default class DataTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {columns, rows, searching, backendPagination, disableRetreatAfterSorting, displayEntries, paging} = this.props
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
                    paging={paging}
                    striped
                    bordered
                    small
                    displayEntries={displayEntries}
                    searching={searching}
                    disableRetreatAfterSorting={disableRetreatAfterSorting}
                    data={data}
                    noBottomColumns={true}
                />)
    }
}

DataTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    searching : PropTypes.bool,
    backendPaginated : PropTypes.bool,
    disableRetreatAfterSorting : PropTypes.bool,
    displayEntries: PropTypes.bool,
    paging: PropTypes.bool,
}

DataTable.defaultProps = {
    backendPaginated : false,
    paging : true,
    displayEntries : true,
    disableRetreatAfterSorting : false
}
