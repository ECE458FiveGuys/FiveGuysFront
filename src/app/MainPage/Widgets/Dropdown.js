import React, {Component} from "react";
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";
import ModelFields from "../../../utils/enums";
import Login from "../../../auth/Login";
import PropTypes from "prop-types";

class Dropdown extends Component {

    constructor(props) {
        super(props)
    }

    handleSelect = e => this.props.updateSearchField(e.target)

    render() {
        let DropdownItems = []
        for (const field in ModelFields.EquipmentModelSearchFields) {
            DropdownItems.push(<MDBDropdownItem onclick={this.handleSelect}>{field}</MDBDropdownItem>)
        }
        return (
            <MDBDropdown>
                <MDBDropdownToggle caret color="primary">
                    Search Fields
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