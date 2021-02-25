import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import TableColumns from "../InventoryTables/Columns";
import PropTypes from "prop-types";
import InventoryTable from "../InventoryTables/InventoryTable";
import {Search} from "semantic-ui-react";
import ModelFields from "../../../utils/enums";
import {Typeahead} from "react-bootstrap-typeahead"
import {Form} from "react-bootstrap"
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import Image from "../../../assets/hpt_logo.png";

let SEARCH_FIELD_COLS = 4

export default class SearchHeader extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchField: "All",
        }
    }

    renderSearchBox(searchFieldName, searchFieldTitle) {
        return(
            <MDBCol size={3}>
                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    {searchFieldTitle}
                </label>
                <input type="text"
                       placeholder={"Search"}
                       className="form-control"
                       onChange={event => this.props.updateSearchFieldValues(searchFieldName, event.target.value)}/>
                <br/>
            </MDBCol>)
    }

    renderAutoCompleteSearchBox(searchFieldName, searchFieldTitle) {
        return(
            <MDBCol size={3}>
            <Form.Group>
                <Form.Label className="grey-text">{searchFieldTitle}</Form.Label>
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="name"
                      onInputChange={event => {
                          this.props.updateSearchFieldValues(searchFieldName, event)
                      }}
                      onChange={event => {
                          this.props.updateSearchFieldValues(searchFieldName, event[0])
                      }}
                      options={this.props.vendors}
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
        let {searchFields} = this.props
        Object.keys(searchFields).forEach(key => {
            let searchFieldName = searchFields[key]
            if (searchFieldName == ModelFields.EquipmentModelFields.VENDOR) {
                Rows.push(this.renderAutoCompleteSearchBox(searchFieldName, key))
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
    vendors: PropTypes.string.isRequired
}