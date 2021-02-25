import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import TableColumns from "../InventoryTables/Columns";
import PropTypes from "prop-types";
import InventoryTable from "../InventoryTables/InventoryTable";
import {Search} from "semantic-ui-react";
import ModelFields from "../../../../utils/enums";
import {Typeahead} from "react-bootstrap-typeahead"
import {Form} from "react-bootstrap"
import 'react-bootstrap-typeahead/css/Typeahead.css';

let SEARCH_FIELD_COLS = 8

export default class SearchHeader extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchField: "All",
            searchFieldValues: {}
        }
    }

    renderSearchBox(searchFieldName, searchFieldTitle) {
        return(
            <MDBCol size={2}>
                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    {searchFieldTitle}
                </label>
                <input type="text"
                       placeholder={"Search"}
                       className="form-control"
                       onChange={event =>  this.state.searchFieldValues[searchFieldName] = event.target.value}/>
                <br/>
            </MDBCol>)
    }

    renderAutoCompleteSearchBox(searchFieldName, searchFieldTitle) {
        return(
            <MDBCol size={2}>
            <Form.Group>
                <Form.Label className="grey-text">{searchFieldTitle}</Form.Label>
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="name"
                      onInputChange={event => {
                          this.state.searchFieldValues[searchFieldName] = event
                      }}
                      onChange={event => {
                          this.state.searchFieldValues[searchFieldName] = event[0]
                      }}
                      options={this.props.vendors}
                      placeholder="Search"
                      selected={""}
                    />
                  </Form.Group>
            </MDBCol>
        )
    }

    renderAutoCompleteMultipleSearchBox(searchFieldName, searchFieldTitle) {
        let options = []
        if (searchFieldName == ModelFields.EquipmentModelFields.MODEL_CATEGORIES) {
            options = this.props.modelCategories
        } else if (searchFieldName == ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES) {
            options = this.props.instrumentCategories
        }
        return(
            <MDBCol size={3}>
            <Form.Group>
                <Form.Label className="grey-text">{searchFieldTitle}</Form.Label>
                <Typeahead
                    id="basic-typeahead-multiple"
                    labelKey="name"
                    multiple
                    onChange={event => {
                        this.state.searchFieldValues[searchFieldName] = event
                    }}
                    options={options}
                    placeholder="Search"
                    selected={""}
                />
            </Form.Group>
                </MDBCol>
        )
    }

    render() {
        let Rows = []
        let col = 1
        let {searchFields, updateSearchFieldValues} = this.props
        Object.keys(searchFields).forEach(key => {
            let searchFieldName = searchFields[key]
            if (searchFieldName == ModelFields.EquipmentModelFields.VENDOR) {
                Rows.push(this.renderAutoCompleteSearchBox(searchFieldName, key))
            } else if (searchFieldName == ModelFields.EquipmentModelFields.MODEL_CATEGORIES ||
                searchFieldName == ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES) {
                Rows.push(this.renderAutoCompleteMultipleSearchBox(searchFieldName, key))
            } else {
                Rows.push(this.renderSearchBox(searchFieldName, key))
            }
            if (col == SEARCH_FIELD_COLS) {
                Rows.push(<div className="w-100"/>)
                col = 1
            } else {
                col+=1
            }
            }
        )
        Rows.push(
            <MDBCol size={1} style={{display: "flex", marginLeft: 20, alignItems : "center", justifyContent:"center"}}>
            <button type="button"
                    className="btn btn-primary"
                    onClick={()=>updateSearchFieldValues(this.state.searchFieldValues)}>
                Search
            </button>
                </MDBCol>
        )

        return(
            <MDBContainer style={{marginLeft: -15, display: "inline"}}>
                <header className={"h5-responsive"} style={{marginTop: 10, marginBottom: 10}}>
                    Search Your Inventory
                </header>
                <MDBRow>
                    {Rows}
                </MDBRow>
            </MDBContainer>
        )
    }
}


SearchHeader.propTypes = {
    searchFields: PropTypes.object.isRequired,
    updateSearchFieldValues: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    vendors: PropTypes.array.isRequired,
    modelCategories: PropTypes.array.isRequired,
    instrumentCategories: PropTypes.array
}