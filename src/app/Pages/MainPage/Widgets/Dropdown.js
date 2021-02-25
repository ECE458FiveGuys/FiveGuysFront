import React, {Component} from "react";
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";
import ModelFields from "../../../../utils/enums";
import Login from "../../../../auth/Login";
import PropTypes from "prop-types";

class Dropdown extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchField : "All"
        }
    }

    handleSelect = e => {
        let value = e.target.innerHTML
        this.setState({searchField : value})
        this.props.updateSearchField(value)
    }

    render() {
        let DropdownItems = []
        Object.keys(ModelFields.EquipmentModelSearchFields).forEach(element => {
                DropdownItems.push(<MDBDropdownItem onClick={e => this.handleSelect(e)}>{element}</MDBDropdownItem>)
            }
        )
        return (
            <MDBDropdown size={"sm"}>
                <MDBDropdownToggle caret color="primary">
                    {this.state.searchField}
                </MDBDropdownToggle>
                <MDBDropdownMenu basic>
                    {DropdownItems}
                </MDBDropdownMenu>
            </MDBDropdown>
        );
    }
}

Dropdown.propTypes = {
    updateSearchField: PropTypes.func.isRequired
}

export default Dropdown;