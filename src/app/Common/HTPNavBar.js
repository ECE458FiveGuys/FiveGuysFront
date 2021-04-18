import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import PropTypes from "prop-types";
import {User} from "../../utils/dtos";
import {SHORTEN_LABELS} from "../Pages/CreateFunctions/CreateUser";
import {getToken, Logout} from "../../auth/auth_utils";
import MiscellaneousRequests from "../../controller/requests/miscellaneous_requests";

class NavbarPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        this.getPendingApproval();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    getPendingApproval = () => {
        MiscellaneousRequests.getPendingApproval(getToken(), (json) => this.setState({pendingApproval : json}), (error) => alert(error))
    }

    render() {
        let {user, location, navbarColor} = this.props
        let Buttons = []
        if (user.groups.includes(SHORTEN_LABELS.ADMINISTRATOR) || user.groups.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT) || user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT))
        Buttons.push(<MDBNavItem active={location.pathname == "/categories"}>
            <MDBNavLink to="/categories">Categories</MDBNavLink>
        </MDBNavItem>)
        if (user.groups.includes(SHORTEN_LABELS.ADMINISTRATOR)) {
            Buttons.push(<MDBNavItem active={location.pathname == "/users"}>
                <MDBNavLink to="/users">Users</MDBNavLink>
            </MDBNavItem>)
            Buttons.push(<MDBNavItem active={location.pathname == "/import-export"}>
                <MDBNavLink to="/import-export">{"Import"}</MDBNavLink>
            </MDBNavItem>)
        }
        return (
                <MDBNavbar color={navbarColor} dark expand="md">
                    <MDBNavbarBrand>
                        <strong className="white-text">HPT</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active={location.pathname == "/"}>
                                <MDBNavLink to="/">Inventory</MDBNavLink>
                            </MDBNavItem>
                            {Buttons}
                        </MDBNavbarNav>
                        <text className={"white-text"} style={{position: "absolute", left: (window.innerWidth - 140) / 2}}>
                            {`Welcome, ${location.pathname == "/user-settings" ? user.username : user.getFirstName()}`}
                        </text>
                        <MDBNavbarNav right>
                            {(user.groups.includes(SHORTEN_LABELS.ADMINISTRATOR) || user.groups.includes(SHORTEN_LABELS.CALIBRATION_APPROVER)) &&
                            <MDBNavItem
                                style={{display : "flex", flexDirection : "row", marginRight : 10}}
                                active={location.pathname == "/pending-calibrations"}>
                                <MDBNavLink to="/pending-calibrations">
                                    <MDBIcon icon="bell"/>
                                </MDBNavLink>
                                <div style={{backgroundColor : "orange", color : "white", marginLeft : -15, borderRadius : "20%", height : 20, display : "flex", justifyContent : 'center', alignItems : "center"}}>
                                    <text style={{marginLeft : 5, marginRight : 5}}>{this.state.pendingApproval ? this.state.pendingApproval.length : 0}</text>
                                </div>
                            </MDBNavItem>}
                            <MDBNavItem style={{marginRight: 100}}>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-menu">
                                        <MDBDropdownItem href="/"
                                                         onClick={Logout}>
                                            Logout
                                        </MDBDropdownItem>
                                        {!user.isNetIdUser() && <MDBDropdownItem href="/user-settings">User Settings</MDBDropdownItem>}
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
        );
    }
}

export default NavbarPage;

NavbarPage.propTypes = {
    navbarColor : PropTypes.string,
    user : PropTypes.instanceOf(User).isRequired,
    location : PropTypes.object.isRequired
}

NavbarPage.defaultProps = {
    navbarColor : "green"
}