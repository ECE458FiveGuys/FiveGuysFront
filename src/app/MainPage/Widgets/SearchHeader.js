import {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import TableColumns from "../InventoryTables/Columns";
import PropTypes from "prop-types";
import InventoryTable from "../InventoryTables/InventoryTable";
import {Search} from "semantic-ui-react";

let SEARCH_FIELD_COLS = 4

export default class SearchHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchField: "All"
        }
    }

    render() {
        let Rows = []
        let col = 1
        let {searchFields, updateSearchFieldValues} = this.props
        Object.keys(searchFields).forEach(key => {
            let searchFieldName = searchFields[key]
            Rows.push(<MDBCol size={3}>
                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    {key}
                </label>
                <input type="text"
                       placeholder={"Search"}
                       className="form-control"
                       onChange={event => updateSearchFieldValues(searchFieldName, event.target.value)}/>
                <br/>
            </MDBCol>)
            if (col == SEARCH_FIELD_COLS) {
                Rows.push(<div className="w-100"/>)
                col = 1
            } else {
                col+=1
            }
            }
        )
        return(
            <MDBContainer style={{marginLeft: -15}}>
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
    updateSearchFieldValues: PropTypes.func.isRequired
}