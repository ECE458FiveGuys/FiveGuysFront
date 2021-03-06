import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import PropTypes from "prop-types";
import ModelFields from "../../../../../utils/enums";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import HTPAutoCompleteInput from "../../../../Common/Inputs/HTPAutoCompleteInput";
import HTPInput from "../../../../Common/Inputs/HTPInput";
import {EquipmentModel, Instrument, Models} from "../../../../../utils/ModelEnums";
import {User} from "../../../../../utils/dtos";

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

    renderSearchButton = () => {
        return(<MDBCol size={1} style={{display: "flex", marginLeft: 20, marginRight : 20, alignItems : "center", justifyContent:"center"}}>
                    <button type="submit"
                            className="btn btn-primary">
                        Search
                    </button>
                </MDBCol>)
    }

    appendSearchFields = (Rows, col) => {
        let {searchFields} = this.props
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

    }

    render() {
        let Rows = []
        let col = 1
        this.appendSearchFields(Rows, col)
        Rows.push(this.renderSearchButton())
        Rows.push(this.props.legend)

        let type = this.getTableType() == ModelFields.ModelTypes.EQUIPMENT_MODEL ? "Models" : "Instruments"

        return(
            <div style={{display: "inline"}}>
                <header className={"h3-responsive"} style={{marginTop: 10, marginBottom: 10}}>
                    {`Search Your ${type}`}
                </header>
                <div style={{display: 'flex', flexDirection : "row"}}>
                    <form
                        onClick={(e)=> {e.preventDefault()
                            this.props.updateSearchFieldValues(this.state.searchFieldValues)
                        }}
                        >
                        <div style={{display : 'flex', flexDirection : 'row', flex : 1, flexWrap : 'wrap'}}>
                            {Rows}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}


SearchHeader.propTypes = {
    searchFields: PropTypes.object.isRequired,
    updateSearchFieldValues: PropTypes.func,
    token: PropTypes.string.isRequired,
    vendors: PropTypes.array.isRequired,
    modelCategories: PropTypes.array.isRequired,
    instrumentCategories: PropTypes.array,
    user : PropTypes.instanceOf(User),
    history : PropTypes.object.isRequired
}

SearchHeader.defaultProps = {
    searchFields : {}
}