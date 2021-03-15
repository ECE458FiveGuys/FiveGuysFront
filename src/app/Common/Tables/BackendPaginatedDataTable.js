import React, { Component } from "react";
import { MDBDataTable } from 'mdbreact';
import PropTypes from "prop-types";
import Loading from "../Images/Loading";
import {PaginatedResponseFields} from "./TableUtils/pagination_utils";
import Paginator from "./TableWidgets/Paginator";
import {EquipmentModel, Instrument} from "../../../utils/ModelEnums";
import TableColumns from "./TableUtils/Columns";
import {act} from "@testing-library/react";

export default class BackendPaginatedDataTable extends Component {

    static PER_PAGE = 10

    constructor(props) {
        super(props)
        this.state = {
            activePage : 1,
            sortBy : undefined
        }
    }

    componentDidMount() {
        this.handleFetch(this.state.activePage)
    }

    forceSearch = () => {
        this.handleFetch(1)
    }

    forceParseData = () => {
        this.setState({parsedRows :
                this.props.dataFetchFunctionParser(this.state.rawFetchData)})
    }

    handleFetch = (activePage) => {
        let {dataFetchFunction, dataFetchFunctionParser, token, searchParams} = this.props
        let dataFetchCallBack = (rawFetchData) => {
            let savedRawFetchData = JSON.parse(JSON.stringify(rawFetchData))
            const numEntries = rawFetchData[PaginatedResponseFields.COUNT]
            const numPages = Math.ceil(rawFetchData[PaginatedResponseFields.COUNT] / BackendPaginatedDataTable.PER_PAGE)
            let parsedRows = dataFetchFunctionParser(rawFetchData[PaginatedResponseFields.RESULTS])
            this.setState({numPages : numPages, parsedRows : parsedRows, rawFetchData : savedRawFetchData[PaginatedResponseFields.RESULTS],
                activePage : activePage, numEntries : numEntries})
        }
        dataFetchFunction(token, searchParams, dataFetchCallBack, (errorMessage) => alert(errorMessage), activePage, this.state.sortBy)
    }

    onSort = ({column, direction}) => {
        let {activePage, sortBy} = this.state
        if (column == EquipmentModel.FIELDS.MODEL_CATEGORIES || column == Instrument.FIELDS.INSTRUMENT_CATEGORIES) {
            this.handleFetch(activePage)
            return
        }
        let newSortBy = column

        if (sortBy && (sortBy == column || sortBy.substring(1) == column)) {
            if (!sortBy.startsWith("-")) {
                newSortBy = "-" + sortBy
            }
        }
        this.setState({sortBy : newSortBy}, () => {
            this.handleFetch(activePage, `${direction}${column}`)
        })
    }

    getNumEntries = () => {
        return this.state.numEntries
    }

    render() {
        let {columns, getPage} = this.props
        let {parsedRows, numPages, activePage, numEntries} = this.state
        let data = {
            columns: columns,
            rows: parsedRows
        }
        return !parsedRows ?
            (<Loading/>)
            :
            (<div>
                <MDBDataTable
                    autoWidth={false}
                    hover
                    striped
                    bordered
                    small
                    searching={false}
                    data={data}
                    noBottomColumns={true}
                    displayEntries={false}
                    sortable={true}
                    onSort={this.onSort}
                    info={false}
                    paging={false}
                />
                <div style={{display : 'flex', justifyContent : 'space-between'}}>
                    <b>{`Showing ${(BackendPaginatedDataTable.PER_PAGE * (activePage - 1)) + 1} to 
                                ${BackendPaginatedDataTable.PER_PAGE * activePage < numEntries ? BackendPaginatedDataTable.PER_PAGE * activePage : numEntries} of 
                                ${numEntries} entries`}</b>
                    <Paginator onPageChange={this.handleFetch}
                               numPages={numPages}
                               activePage={activePage}
                    />
                </div>
            </div>)
    }
}

BackendPaginatedDataTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    dataFetchFunction : PropTypes.func.isRequired,
    dataFetchFunctionParser : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    searchParams : PropTypes.string.isRequired
}
