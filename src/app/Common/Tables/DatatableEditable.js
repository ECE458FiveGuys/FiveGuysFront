import React, { Component } from "react";
import {MDBDataTable} from 'mdbreact';
import PropTypes from "prop-types";
import Loading from "../Images/Loading";
import DataTable from "./DataTable";
import Checkbox from "./TableWidgets/Checkbox";

const SELECT = "Select"
const DELETE = "Delete"

export default class DatatableEditable extends Component {

    static SELECT = "Select"
    static DELETE = "Delete"

    constructor(props) {
        super(props)
        this.state = {
            columns : this.appendEditableFeatures(this.props.columns),
            rows : this.addEditFunctions(this.props.rows),
            selectedPK : undefined
        }
        this.updateSelectedPK = this.updateSelectedPK.bind(this)
    }

    updateSelectedPK(pk) {
        this.setState({selectedPK : pk})
    }

    addEditFunctions(rows) {
        rows.forEach(row => {
            row[SELECT] = <Checkbox correspondingPK={row.pk ? row.id : row.pk}
                                    updateSelectedPK={this.updateSelectedPK}
                            />
        })
    }

    appendEditableFeatures(columns) {
        columns.unshift({label : SELECT})
        columns.push({label : DELETE})
    }

    render() {
        let {columns, rows} = this.state
        let {editableColumns} = this.props
        editableColumns.forEach(field => {

        })
        return(<div>
                    <div>

                    </div>
                    <DataTable columns={columns}
                               rows={rows}/>
                </div>
                )
    }
}

DatatableEditable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    editableColumns : PropTypes.array.isRequired
}