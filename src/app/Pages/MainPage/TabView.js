import React, { Component } from "react";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";
import ModelTable from "./InventoryTables/ModelTable";
import InstrumentTable from "./InventoryTables/InstrumentTable";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";

class TabView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: props.modelPage ? "1" : "2"
        };

    }
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    render() {
        let {modelPage, instrumentPage} = this.props
        return (
            <MDBContainer fluid={true} className={"fill-most-window"}>
                <MDBNav className="nav-tabs mt-4">
                    {modelPage && <MDBNavItem>
                        <MDBNavLink link to="#" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                            Models
                        </MDBNavLink>
                    </MDBNavItem>}
                    {instrumentPage && <MDBNavItem>
                        <MDBNavLink link to="#" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                            Instruments
                        </MDBNavLink>
                    </MDBNavItem>}
                </MDBNav>
                <MDBTabContent
                    activeItem={this.state.activeItem} >
                    {modelPage && <MDBTabPane tabId="1" role="tabpanel" >
                        {modelPage}
                    </MDBTabPane>}
                    {instrumentPage && <MDBTabPane tabId={"2"} role="tabpanel">
                        {instrumentPage}
                    </MDBTabPane>}

                </MDBTabContent>
            </MDBContainer>
        );
    }
}
export default TabView;

TabView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    modelPage : PropTypes.element,
    instrumentPage : PropTypes.element
}
