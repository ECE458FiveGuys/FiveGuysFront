import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import PropTypes from "prop-types";
import ModelFields from "../../../../utils/enums";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";
import HTPInput from "../../../Common/Inputs/HTPInput";
import {EquipmentModel, Instrument, Models} from "../../../../utils/ModelEnums";
import UpdateInstrument from "../../InstrumentDetailPage/Sections/UpdateInstrument";

let SEARCH_FIELD_COLS = 8

export default class ActionHeader extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchField: "All",
            searchFieldValues: {}
        }
        this.updateSearchFields = this.updateSearchFields.bind(this)
    }

    getTableType = () => {
        return this.props.searchFields == EquipmentModel.SEARCH_FIELDS ? EquipmentModel.TYPE : Instrument.TYPE
    }

    updateSearchFields = (searchFieldName) => (value) => {
        this.state.searchFieldValues[searchFieldName] = value
        this.setState({searchFieldValues : this.state.searchFieldValues})
    }

    renderAutoCompleteMultipleSearchBox(searchFieldName, searchFieldTitle) {
        let options = []
        if (searchFieldName == ModelFields.EquipmentModelFields.MODEL_CATEGORIES) {
            options = this.props.modelCategories
        } else if (searchFieldName == ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES) {
            options = this.props.instrumentCategories
        }
        return (<HTPAutoCompleteInput placeholder={"Search"}
                                      options={options}
                                      onChange={this.updateSearchFields(searchFieldName)}
                                      label={searchFieldTitle}
                                      multiple={true}
                                      size={3}/>)
        }

    render() {
        let Rows = []
        let col = 1
        let {searchFields, updateSearchFieldValues, token, updatePageState} = this.props
        Object.keys(searchFields).forEach(key => {
            let searchFieldName = searchFields[key]
            if (searchFieldName == ModelFields.EquipmentModelSearchFields.Vendor ||
                searchFieldName == ModelFields.InstrumentSearchFields.Vendor) {
                Rows.push(<HTPAutoCompleteInput placeholder={"Search"}
                                                options={this.props.vendors}
                                                onChange={this.updateSearchFields(searchFieldName)}
                                                label={key}/>)
            } else if (searchFieldName == ModelFields.EquipmentModelFields.MODEL_CATEGORIES ||
                searchFieldName == ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES) {
                Rows.push(this.renderAutoCompleteMultipleSearchBox(searchFieldName, key))
            } else {
                Rows.push(<MDBCol size={2}>
                            <HTPInput label={key}
                                    onChange={this.updateSearchFields(searchFieldName)}
                                    placeholder={"Search"}/>
                            </MDBCol>)
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
        Rows.push(
            <MDBCol size={1} style={{display: "flex", marginLeft: 20, alignItems : "center", justifyContent:"center"}}>
                <UpdateInstrument
                    mode={UpdateInstrument.CREATE_MODE}
                    token={token}
                    updatePageState={updatePageState}/>
            </MDBCol>
        )

        let type = this.getTableType() == ModelFields.ModelTypes.EQUIPMENT_MODEL ? "Models" : "Instruments"

        return(
            <MDBContainer style={{marginLeft: -15, display: "inline"}}>
                <header className={"h5-responsive"} style={{marginTop: 10, marginBottom: 10}}>
                    {`Search Your ${type}`}
                </header>
                <MDBRow>
                    {Rows}
                </MDBRow>
            </MDBContainer>
        )
    }
}


ActionHeader.propTypes = {
    searchFields: PropTypes.object.isRequired,
    updateSearchFieldValues: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    vendors: PropTypes.array.isRequired,
    modelCategories: PropTypes.array.isRequired,
    instrumentCategories: PropTypes.array
}