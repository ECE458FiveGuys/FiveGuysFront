import React, { Component } from "react";
import PropTypes from "prop-types";
import DataTable from "./DataTable";
import Checkbox from "./TableWidgets/Checkbox";
import HTPInput from "../Inputs/HTPInput";
import HTPButton from "../Inputs/HTPButton";

const SELECT = "Select"
const DELETE = "Delete"
const CHECK_BOX_REF = "CheckboxRef"

export default class DatatableEditable extends Component {

    constructor(props) {
        super(props)
        this.updateSelectedRow = this.updateSelectedRow.bind(this)
        this.state = {
            pkToRow: new Map(),
            fieldMap: {}  // object of column fields to current input values
        }

        Object.assign(this.state, {
            columns: this.appendEditableFeatures(this.props.columns),
            rows: this.addEditFunctions(this.props.rows, this.state.pkToRow),
            selectedRow: undefined
        })

        Object.assign(this.state, this.createEditableFields())
    }

    addEditFunctions(propRows, pkToRow) {
        let rows = []
        propRows.forEach(propRow => {
            let row = {}
            Object.assign(row, propRow)
            let checkBoxRef = React.createRef()
            row[SELECT] = <Checkbox correspondingPK={row.pk ? row.pk : row.id}
                                    updateSelectedRow={this.updateSelectedRow}
                                    ref={checkBoxRef}
            />
            row[CHECK_BOX_REF] = checkBoxRef
            pkToRow.set(row.pk ? row.pk : row.id, row)
            row.clickEvent = () => {checkBoxRef.current.check()} // if you click anywhere in row, will check the box
            rows.push(row)
        })
        return rows
    }

    appendEditableFeatures(propColumns) {
        let columns = [...propColumns]
        columns.unshift({label : SELECT, field : SELECT})
        return columns
    }


    createEditableFields() {
        let {editableColumns} = this.props
        let EditableFields = []
        let editableFieldRefs = new Map()
        editableColumns.forEach(column => {
            let fieldRef = React.createRef()
            let Input = (<HTPInput label={column.label}
                                   onChange={(value)=>{this.state.fieldMap[column.field] = value
                                                       this.setState({fieldMap: this.state.fieldMap})
                                   }}
                                   ref={fieldRef}
                                   placeholder={column.label}/>)
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
        // if row already selected, remove that check, then update the one selected
        let selectedRow = this.state.selectedRow
        if (selectedRow && selectedRow.pk && selectedRow.pk != pk) {
            this.state.pkToRow.get(selectedRow.pk)[CHECK_BOX_REF].current.forceUncheck()
        }
        let updatedSelectedRow = undefined
        if (pk) {
            this.state.rows.every(row => {
                if (row.pk == pk) {
                    updatedSelectedRow = row
                    return false
                }
                else {
                    return true
                }
            })
        }
        this.setState({selectedRow: updatedSelectedRow, successMessage: undefined, errorMessage: undefined},
            () => this.updateFields(() => callBack()))
    }

    onSubmit = () => {
        let {rows, selectedRow, fieldMap} = this.state
        let {token, editFunction, createFunction} = this.props
        selectedRow ?
        editFunction(token,
            selectedRow.pk,
            (json) => {Object.keys(json).forEach(key =>
                selectedRow[key] = json[key])
                this.setState({selectedRow : selectedRow, successMessage : "Successfully Edited"})
            },
            (errorMessage) => this.setState({errorMessage : errorMessage}),
            fieldMap)
        :
        createFunction(token,
            (json) => {
                rows.push(json)
                this.setState({rows: this.addEditFunctions(rows, this.state.pkToRow), successMessage : "Successfully Created"})
            },
            (errorMessage) => this.setState({errorMessage : errorMessage}),
            fieldMap)
    }

    onDelete = () => {
        let {token, deleteFunction} = this.props
        let {selectedRow, rows} = this.state
        deleteFunction(token,
                        selectedRow.pk,
                        (json) => {
                            let indexToRemove = 0
                            for (let i = 0; i < rows.length; i++) {
                                let row = rows[i]
                                if (row.pk == selectedRow.pk) {
                                    indexToRemove = i
                                    break
                                }
                            }
                            rows.splice(indexToRemove, 1);
                            this.updateSelectedRow(undefined,
                                () => this.setState({successMessage : "Successfully Deleted"}))
                        },
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

    render() {
        let {columns, rows, selectedRow, EditableFields, errorMessage, successMessage} = this.state
        return(<div style={{marginTop : 30}}>
                    <div style={{flexDirection : 'row', display: "flex", alignItems : "center"}}>
                        {EditableFields}
                        <HTPButton onSubmit={this.onSubmit}
                                   disabled={selectedRow ? this.unChanged() : false}
                                   label={selectedRow ? "Edit" : "Create"}/>
                        {selectedRow ? <HTPButton onSubmit={this.onDelete}
                                                  color={"red"}
                                                  label="Delete"/> : <div/>}
                        {errorMessage ? <text style={{marginLeft: 20}} className={"text-danger"}>{errorMessage}</text> :
                            successMessage ? <text style={{marginLeft: 20}} className={"text-success"}>{successMessage}</text> : <div/>}
                    </div>
                    <DataTable columns={columns}
                               rows={rows}/>
                </div>
                )
    }
}

DatatableEditable.propTypes = {
    token : PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired, // the columns of the datatable
    rows : PropTypes.array.isRequired,
    editableColumns : PropTypes.array.isRequired, // a subset of columns whose fields you want to have inputs for
    editFunction : PropTypes.func.isRequired, // a shared library API function to be called when the edit button is selected
    createFunction : PropTypes.func.isRequired, // a shared library API function to be called when the create button is selected
    deleteFunction : PropTypes.func.isRequired, // a shared library API function to be called when the delete button is selected
}