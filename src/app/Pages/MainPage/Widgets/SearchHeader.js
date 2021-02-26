import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import PropTypes from "prop-types";
import ModelFields from "../../../../utils/enums";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import AutoCompleteInput from "../../../Common/Inputs/AutoCompleteInput";

let SEARCH_FIELD_COLS = 8

export default class SearchHeader extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchField: "All",
            searchFieldValues: {}
        }
        this.updateSearchFields = this.updateSearchFields.bind(this)
    }

    updateSearchFields = (searchFieldName) => (value) => {
        this.state.searchFieldValues[searchFieldName] = value
        this.setState({searchFieldValues : this.state.searchFieldValues})
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
                       onChange={event => this.updateSearchFields(searchFieldName)(event.target.value)}/>
                <br/>
            </MDBCol>)
    }

    renderAutoCompleteMultipleSearchBox(searchFieldName, searchFieldTitle) {
        let options = []
        if (searchFieldName == ModelFields.EquipmentModelFields.MODEL_CATEGORIES) {
            options = this.props.modelCategories
        } else if (searchFieldName == ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES) {
            options = this.props.instrumentCategories
        }
        return (<AutoCompleteInput placeholder={"Search"}
                                   options={options}
                                   onChange={this.updateSearchFields(searchFieldName)}
                                   label={searchFieldTitle}
                                   multiple={true}
                                   size={3}/>)
        }

    render() {
        let Rows = []
        let col = 1
        let {searchFields, updateSearchFieldValues} = this.props
        Object.keys(searchFields).forEach(key => {
            let searchFieldName = searchFields[key]
            if (searchFieldName == ModelFields.EquipmentModelFields.VENDOR) {
                Rows.push(<AutoCompleteInput placeholder={"Search"}
                                           options={this.props.vendors}
                                           onChange={this.updateSearchFields(searchFieldName)}
                                           label={key}/>)
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