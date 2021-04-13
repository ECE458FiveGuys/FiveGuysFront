import React, { Component } from "react";
import PropTypes from "prop-types";
import DataTable from "./DataTable";
import HTPInput from "../Inputs/HTPInput";
import HTPButton from "../HTPButton";
import {MDBBtn, MDBCol} from "mdbreact";
import HTPPopup from "../HTPPopup";
import {User} from "../../../utils/dtos";
import {PaginatedResponseFields} from "./TableUtils/pagination_utils";
import {UserError} from "../../../controller/exceptions";

export default class DatatableEditable extends Component {

    constructor(props) {
        super(props)
        this.updateSelectedRow = this.updateSelectedRow.bind(this)
        this.state = this.initialize()
        this.state.fieldMap = {}  // object of column fields to current input values
        this.state.modal = false
        Object.assign(this.state, this.createEditableFields())
    }

    initialize = () => {
        let state = {
            pkToRow: new Map(),
            pkToParsedRow : {},
        }

        Object.assign(state, {
            parsedRows: this.parseRows(this.props.rows, state.pkToRow, state.pkToParsedRow),
            selectedRow: undefined
        })

        return state
    }

    reinitialize = (callBack) => {
        this.props.reloadRows(() => this.setState(this.initialize(), callBack()))
    }


    highlightRow(rowPk) {
        this.highlightRowHelper(rowPk, false)
    }

    unHighlightRow(rowPk) {
        this.highlightRowHelper(rowPk, true)
    }

    highlightRowHelper(rowPk, unhighlight = false) {
        let parsedRow = this.state.pkToParsedRow[rowPk]
        Object.keys(parsedRow).forEach(rowFieldKey => {
            if (rowFieldKey != "clickEvent" && rowFieldKey != "pk") {
                let actualFieldValue = this.state.pkToRow.get(rowPk)[rowFieldKey]
                parsedRow[rowFieldKey] = unhighlight ? actualFieldValue :
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        height: 40,
                        marginTop: -10,
                        marginBottom: -10,
                        marginLeft: -5,
                        marginRight: -5,
                        overflow: true,
                        background: "lightgray"
                    }}>
                        <text style={{marginLeft: 5}}>{actualFieldValue}</text>
                    </div>
                this.state.pkToParsedRow[rowPk] = parsedRow
                this.setState({parsedRows: this.state.parsedRows})
            }
        })
    }

    parseRows(propRows, pkToRow, pkToParsedRow) {
        let parsedRows = []
        propRows.forEach(propRow => {
            let row = {...propRow}
            pkToRow.set(row.pk ? row.pk : row.id, {...row})
            row.clickEvent = () => {
                this.updateSelectedRow(row.pk)
            }
            pkToParsedRow[row.pk ? row.pk : row.id] = {...row}
            // highlights row on click
            parsedRows.push(row)
        })
        return parsedRows
    }

    createEditableFields() {
        let {editableColumns} = this.props
        let EditableFields = []
        let editableFieldRefs = new Map()
        editableColumns.forEach(column => {
            let fieldRef = React.createRef()
            let Input = (<MDBCol size={2}>
                            <HTPInput label={column.label}
                                   onChange={(value)=>{this.state.fieldMap[column.field] = value
                                                       this.setState({fieldMap: this.state.fieldMap})
                                   }}
                                   ref={fieldRef}
                                   placeholder={column.label}/>
                        </MDBCol>)
            EditableFields.push(Input)
            editableFieldRefs.set(column.field, fieldRef)
        })
        return {EditableFields : EditableFields, editableFieldRefs : editableFieldRefs}
    }

    updateFields(callBack=()=>{}) {
        this.state.editableFieldRefs.forEach((inputRef, columnField)=> {
            if (!this.state.selectedRow) {
                inputRef.current.setValue("")  // if no row is selected, clear inputs
            } else {
                let currentField = this.state.selectedRow[columnField]
                inputRef.current.setValue(currentField)
            }
            this.state.fieldMap[columnField] = inputRef.current.getValue()
            callBack()
        })
    }

    updateSelectedRow(pk, callBack= () => {}) {
        // if row already selected, unselect row, then update the one selected
        let selectedRow = this.state.selectedRow
        let updatedSelectedRow = undefined
        if (selectedRow && selectedRow.pk && pk) {
            this.unHighlightRow(selectedRow.pk)
            if (pk != selectedRow.pk) {
                this.highlightRow(pk)
                updatedSelectedRow = this.state.pkToRow.get(pk)
            }
        } else if (pk) {
            updatedSelectedRow = this.state.pkToRow.get(pk)
            this.highlightRow(pk)
        }
        this.setState({selectedRow: updatedSelectedRow,
                successMessage: undefined,
                errorMessage: undefined,
                warningMessage: undefined,
                    warningFunction : undefined},
            () => this.updateFields(() => callBack()))
    }

    handleErrorMessage = (errorMessage) => {
        this.setState({errorMessage : errorMessage})
        this.toggleModal()
    }

    onSubmit = () => {
        let {selectedRow, pkToParsedRow, pkToRow, fieldMap} = this.state
        let {token, editFunction, createFunction} = this.props
        selectedRow ?
        editFunction(token,
            selectedRow.pk,
            (json) => {Object.keys(json).forEach(key =>
                selectedRow[key] = json[key])
                this.setState({selectedRow : selectedRow, successMessage : "Successfully edited"})
                this.highlightRow(selectedRow.pk)
                this.toggleModal()
            },
            (errorMessage) => this.handleErrorMessage(errorMessage),
            fieldMap)
        :
        createFunction(token,
            (json) => {
                this.reinitialize(() => this.setState({successMessage : "Successfully created"}, this.toggleModal))
            },
            (errorMessage) => this.handleErrorMessage(errorMessage),
            fieldMap)
    }

    onDelete = () => {
        let {validateDeleteFunction} = this.props
        validateDeleteFunction ? this.validateDelete() : this.delete()
    }

    validateDelete = () => {
        let {validateDeleteFunction, token} = this.props
        let {selectedRow} = this.state
        validateDeleteFunction(token,
                                selectedRow,
                                (json) => {
                                    if (json[PaginatedResponseFields.RESULTS].length > 0) {
                                        throw new UserError("Instances using this category exist")
                                    }
                                    this.delete()
                                },
                                (warnMessage) => {
                                    this.setState({warningMessage : warnMessage, warningFunction : this.delete})
                                    this.toggleModal()
                                })
        }

    delete = () => {
        let {token, deleteFunction} = this.props
        let {selectedRow, pkToParsedRow} = this.state
        deleteFunction(token,
            selectedRow.pk,
            (json) => this.reinitialize(() => this.setState({successMessage : "Successfully deleted"}, this.toggleModal)),
            (errorMessage) => this.setState({errorMessage : errorMessage})
        )
    }

    unChanged = () => {
        let unChanged = true;
        Object.keys(this.state.fieldMap).forEach(fieldName => {
            let currentValue = this.state.fieldMap[fieldName]
            let savedValue = this.state.selectedRow[fieldName]
            if (currentValue != savedValue) {
                unChanged = false
            }
        })
        return unChanged
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {columns} = this.props
        let {selectedRow, EditableFields, successMessage, warningMessage, warningFunction, errorMessage} = this.state
        return(<div style={{marginTop : 20}}>
                    <div style={{marginLeft : -15}}>
                        <header className={"h2-responsive"} style={{marginLeft : 15, marginBottom: 10}}>
                            {`Manage Your ${this.props.tableName}`}
                        </header>
                        <text className={"h5-responsive text-default"} style={{marginTop : 30, marginLeft: 15}}>{selectedRow ? `Edit this entry` : "Create New Entry"}</text>
                        <div style={{flexDirection : 'row', display: "flex", alignItems : "center", marginTop : 15}}>
                            {EditableFields}
                            <HTPButton onSubmit={this.onSubmit}
                                       //disabled={selectedRow ? this.unChanged() : false}
                                       label={selectedRow ? "Submit Changes" : "Create"}/>
                            {selectedRow ? <HTPButton onSubmit={this.onDelete}
                                                      color={"red"}
                                                      label="Delete"/> : <div/>}
                            <HTPPopup isOpen={this.state.modal}
                                      toggleModal={this.toggleModal}
                                      className={successMessage ? "text-success" : "text-danger"}
                                      title={successMessage ? "Success!" : warningMessage? "Warning!" : "Error!"}
                                      message={successMessage ? successMessage : warningMessage? warningMessage : errorMessage}
                                      additionalButtons={warningFunction? <MDBBtn color="red" onClick={warningFunction}>Proceed</MDBBtn> : <div/>}/>
                        </div>
                    </div>
                    <div style={{marginTop : -10, marginBottom : -20, cursor: "pointer"}}>
                        <DataTable  disableRetreatAfterSorting={true}
                                    columns={columns}
                                   rows={Object.values(this.state.pkToParsedRow)}/>
                    </div>
                </div>)
    }
}

DatatableEditable.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    editableColumns : PropTypes.array.isRequired, // a subset of columns whose fields you want to have inputs for
    editFunction : PropTypes.func.isRequired, // a shared library API function to be called when the edit button is selected
    createFunction : PropTypes.func, // a shared library API function to be called when the create button is selected
    deleteFunction : PropTypes.func.isRequired, // a shared library API function to be called when the delete button is selected
    validateDeleteFunction: PropTypes.func, // optional function to confirm whether warning should be displayed on delete
    tableName: PropTypes.string,
    reloadRows : PropTypes.func.isRequired
}