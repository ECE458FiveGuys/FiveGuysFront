import React, { Component } from "react";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";
import InventoryTable from "./InventoryTableDep";
import ModelTable from "./InventoryTables/ModelTable";
import InstrumentTable from "./InventoryTables/InstrumentTable";

class TabView extends Component {
    state = {
        activeItem: "1"
    };

    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    render() {
        return (
            <MDBContainer className={"tab-fill-height"}>
                <MDBNav className="nav-tabs mt-5">
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                            Models
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                            Instruments
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
                <MDBTabContent activeItem={this.state.activeItem} >
                    <MDBTabPane tabId="1" role="tabpanel" >
                        <ModelTable/>
                    </MDBTabPane>
                    <MDBTabPane tabId="2" role="tabpanel">
                        <InstrumentTable/>
                    </MDBTabPane>

                </MDBTabContent>
            </MDBContainer>
        );
    }
}
export default TabView;