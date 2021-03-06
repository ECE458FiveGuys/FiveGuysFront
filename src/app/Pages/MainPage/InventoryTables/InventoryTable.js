import React, { Component } from "react";
import PropTypes, {any} from "prop-types";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import ModelFields from "../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import 'jspdf-autotable'
import BackendPaginatedDataTable from "../../../Common/Tables/BackendPaginatedDataTable";
import {User} from "../../../../utils/dtos";
import {Divider} from "@material-ui/core";
import SearchHeader from "../Widgets/InventoryTableHeader/SearchHeader";
import {ActionHeader} from "../Widgets/InventoryTableHeader/ActionHeader";
import Checkbox from "../../../Common/Tables/TableWidgets/Checkbox";
import InstrumentSelectFooter from "../../../Common/Tables/TableWidgets/InstrumentSelectFooter";
import InventoryTableUtils from "./Utils/inventory_table_utils";
import {handleNavClick} from "../../../utils";
import {MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon} from "mdbreact";
import {Logout} from "../../../../auth/auth_utils";
import HTPButton from "../../../Common/HTPButton";
import DataTable from "../../../Common/Tables/DataTable";

class InventoryTable extends Component {

    constructor(props) {
        super(props)
        let searchFieldValues = {}
        Object.values(this.props.searchFields).forEach(value => {
            searchFieldValues[value] = ""
        })
        this.state = {
            searchFieldValues : searchFieldValues,
            paginationMode : true,
            pkToCheckBoxRefs : new Map(), // for select mode. A map of references to all checkboxes on the current page
            pkToEntriesSelected : new Map() // for select mode. A map of references to all instrument pks selected / unselected
        }
        this.selectAllCheckboxRef = React.createRef()
        let columnsCopy = [...props.columns]
        columnsCopy.unshift(this.renderSelectAllCheckBox()) // add column for checkboxes if in select mode
        this.state.selectColumns = columnsCopy

        this.tableRef = React.createRef()
    }

    async componentDidMount() {
        this.loadVendors()
        this.loadCategories()
        this.getAllFunction()
    }

    getAllFunction() {
        let {parseSearchResultsFunction} = this.props
        this.props.getAllFunction(this.props.token, json => this.setState({rows : parseSearchResultsFunction(json)}))
    }

    loadVendors () {
        let getVendorsCallBack = (json) => {
            this.setState({vendors: json})
        }
        MiscellaneousRequests.getVendors(this.props.token, undefined, getVendorsCallBack)
    }

    loadCategories () {
        let {token, searchFields} = this.props
        // categoryType = model_categories or instrument_categories
        let getCategoriesCallBack = (categoryType) => (json) => {
            let categories = json.map(category => {
                return category[ModelFields.CategoryFields.NAME]
            })
            this.setState({[categoryType] : categories})
        }
        MiscellaneousRequests.getCategories(token,
            searchFields == EquipmentModel.SEARCH_FIELDS ? EquipmentModel.TYPE : Instrument.TYPE,
            getCategoriesCallBack)
    }

    /*
    Once search field values are updated, call this.loadTableData to update the table based on the search fields
     */

    updateSearchFieldValues = (searchFieldValues) => {
        this.setState({searchFieldValues : {...searchFieldValues}},
            () => {
                if (this.inSelectMode()) {
                    this.setState({pkToCheckBoxRefs: new Map(), pkToEntriesSelected: new Map()}, () => {
                        this.setState({numSelected : this.calculateNumberSelected()})
                    })
                    this.selectAllCheckboxRef.current.forceUncheck()
                }
                this.tableRef.current.forceSearch()
            }
        )
    }

    updatePageState = (state) => {
        this.setState(state, () => {
            if (this.inSelectMode()) this.tableRef.current.forceParseData()
        })
    }

    getTableType = () => {
        return this.props.searchFields == EquipmentModel.SEARCH_FIELDS ? EquipmentModel.TYPE : Instrument.TYPE
    }

    selectAllCheckBoxes = () => {
        let {pkToCheckBoxRefs, pkToEntriesSelected} = this.state
        pkToCheckBoxRefs.forEach((checkBoxRef, rowPK) => {
            this.selectAllCheckboxRef.current.isChecked() && checkBoxRef.current ?  // if isnt checked currently (thus has just been checked) then check all
                checkBoxRef.current.check() :
                checkBoxRef.current.forceUncheck()
        })
        pkToEntriesSelected.forEach((instrumentSelected, rowPK) => {
            pkToEntriesSelected.set(rowPK, this.selectAllCheckboxRef.current.isChecked())
        })
        this.setState({pkToEntriesSelected : pkToEntriesSelected, pkToCheckBoxRefs : pkToCheckBoxRefs},
            () => this.setState({numSelected : this.calculateNumberSelected()}))
    }

    renderSelectAllCheckBox = () => {
        return {
            label : <div style={{justifyContent : "center", alignItems : 'center', display : "flex", marginLeft : 5, marginRight : -5}}>
                        <Checkbox
                            id={"Select All"}
                            ref = {this.selectAllCheckboxRef}
                            handleSelect={this.selectAllCheckBoxes}/>
                    </div>,
            field : "SELECT",
            sort: 'disabled'
        }
    }

    rowCurrentlyChecked = (rowID) => {
        let {pkToEntriesSelected} = this.state
        return pkToEntriesSelected.get(rowID) != undefined ?
            pkToEntriesSelected.get(rowID) :
            this.selectAllCheckboxRef.current && this.selectAllCheckboxRef.current.isChecked()
    }

    addCheckBoxes = (results) => {
        let {pkToCheckBoxRefs} = this.state
        pkToCheckBoxRefs.clear()
        let parsedResults = results.map(result => {
            let rowID = result.pk
            result.clickEvent = async () => {
                if (this.state.justClicked) {
                    this.setState({justClicked : false})
                    return
                }
                this.setState({justClicked : true})
                let newTab = window.event.ctrlKey
                await this.sleep(100)
                if (!this.state.checkBoxEvent) {
                    handleNavClick("/instruments/" + rowID, this.props.history, newTab)
                } else if (!this.state.checkBoxEvent) {
                    let checkBoxRef = pkToCheckBoxRefs.get(rowID).current
                    checkBoxRef.isChecked() ? checkBoxRef.forceUncheck() : checkBoxRef.check()
                    this.onRowSelect(result.pk)
                }
                this.setState({checkBoxEvent : false, justClicked : false})
            }
            let checkBoxRef = React.createRef()
            // unless case has been overridden by manual select, inherit the state of the select all checkbox
            let checked = this.rowCurrentlyChecked(rowID)
            result.SELECT = <div    style={{height: 40, flex : 1, justifyContent : "center", alignItems : 'center', display : "flex",
                                            marginTop: -10, marginBottom: -10, marginLeft: -5, marginRight: -5}}
                                    onClick={() => !this.state.checkBoxEvent ?
                                                            this.setState({checkBoxEvent : true}) :
                                                            void(0)}>
                                <div style={{marginLeft : 5}}>
                                    <Checkbox
                                        key={`${Math.random()}`}        // the new key forces a re-render so that the default checked value can be used
                                        ref={checkBoxRef}
                                        id={rowID}
                                        defaultChecked={checked}
                                        handleSelect={this.onRowSelect}/>
                                </div>
                            </div>
            pkToCheckBoxRefs.set(rowID, checkBoxRef)
            return result
        })
        return parsedResults
    }

    inSelectMode = () => {
        if (this.selectAllCheckboxRef.current && this.selectAllCheckboxRef.current.isChecked()) return true
        let anyChecked = false
        this.state.pkToCheckBoxRefs.forEach((ref, pk) => {
            if (ref.current && ref.current.isChecked()) anyChecked = true
        })
        return anyChecked
    }

    calculateNumberSelected = () => {
        if (!this.selectAllCheckboxRef.current) return 0
        let selectAll =  this.selectAllCheckboxRef.current.isChecked()
        let totalCount = selectAll ? this.tableRef.current.getNumEntries() : 0
        this.state.pkToEntriesSelected.forEach((selected, pk) => {
            if (selectAll && !selected) {
                totalCount--
            } else if (!selectAll && selected) {
                totalCount ++
            }
        })
        return totalCount
    }

    onRowSelect = (pk) => {
        let {pkToEntriesSelected} = this.state
        pkToEntriesSelected.set(pk, !this.rowCurrentlyChecked(pk))
        this.setState({pkToEntriesSelected : pkToEntriesSelected},
            () => this.setState({numSelected : this.calculateNumberSelected()}))
    }

    resetSelect = () => {
        this.setState({
            numSelected : 0,
            pkToCheckBoxRefs : new Map(),
            pkToEntriesSelected : new Map()
        })
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    render() {
        let {searchRequestFunction, parseSearchResultsFunction, token, columns, searchFields, user, history, getAllFunction} = this.props
        let {searchFieldValues, pkToEntriesSelected, paginationMode, rows} = this.state
        return (
            <div>
                <div style={{display: 'flex', flexDirection : "row"}}>
                    <div style={{display: 'flex', flexDirection : "column", flex : 1, marginTop : 10, marginBottom : 10}}>
                        <SearchHeader searchFields={searchFields}
                                      updateSearchFieldValues={this.updateSearchFieldValues}
                                      token={token}
                                      vendors={this.state.vendors}
                                      modelCategories={this.state.model_categories ? this.state.model_categories : []}
                                      instrumentCategories={this.state.instrument_categories ? this.state.instrument_categories : []}
                                      updatePageState={this.updatePageState}
                                      user={user}
                                      history={history}
                                      legend={this.props.children}
                        />
                    </div>
                    <Divider orientation={'vertical'}
                             flexItem={true}/>
                    <div style={{flex : .1, display: 'flex', justifyContent : 'center', alignItems : 'center'}}>
                        <ActionHeader token={token}
                                      updatePageState={this.updatePageState}
                                      history={history}
                                      user={user}
                                      tableType={this.getTableType()}
                                      selectMode={this.inSelectMode()}
                                      resetSelect={this.resetSelect}
                                      paginationMode={this.state.paginationMode}
                                      searchParams={searchFieldValues}/>
                    </div>
                </div>
                <div style={{marginBottom : this.inSelectMode() ? 25 : -15, cursor: "pointer"}}>
                    {paginationMode ? <BackendPaginatedDataTable columns={this.getTableType() == Instrument.TYPE ? this.state.selectColumns : this.props.columns}
                                               dataFetchFunction={searchRequestFunction}
                                               dataFetchFunctionParser={(data) => {
                                                   data = parseSearchResultsFunction(data)
                                                   return this.getTableType() == Instrument.TYPE ?
                                                       this.addCheckBoxes(data) :
                                                       data
                                                }
                                               }
                                               searchParams={searchFieldValues}
                                               token={token}
                                               ref={this.tableRef}
                    /> :
                        <DataTable rows={rows}
                                   displayEntries={false}
                                   paging={false}
                                   searching={false}
                                   columns={this.props.columns}/>
                    }
                </div>
                {this.inSelectMode() && this.getTableType() == ModelFields.ModelTypes.INSTRUMENT &&
                    <InstrumentSelectFooter instrumentCount={this.state.numSelected}
                                            resetSelect = {this.resetSelect}
                                            getAllFunction={InventoryTableUtils.getAllSelected(token, searchRequestFunction,
                                                getAllFunction, searchFieldValues, this.selectAllCheckboxRef, pkToEntriesSelected)}/>
                    }
            </div>);
    }
}

InventoryTable.propTypes = {
    columns: PropTypes.array.isRequired, // the columns of the datatable
    searchFields: PropTypes.object.isRequired, // the fields of the datatable that should be searchable
    token: PropTypes.string.isRequired, // the token obtained through login
    searchRequestFunction: PropTypes.func.isRequired,  // the request from the shared library used to populate the table
    getAllFunction: PropTypes.func, // a function to return everything from the database (no pagination). This is used for Select Mode
    categoriesName: PropTypes.string.isRequired,
    parseSearchResultsFunction: PropTypes.func, // the parser used to format the data from the request so it can be added to the table
    user: PropTypes.instanceOf(User),
    history: PropTypes.object.isRequired
}

InventoryTable.defaultProps = {
    parseSearchResultsFunction: results => results,
}

export default InventoryTable;