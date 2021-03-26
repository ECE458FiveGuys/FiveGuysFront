import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import {StorageKeys} from "../../utils/enums";
import PropTypes from "prop-types";
import {User} from "../../utils/dtos";
import {SHORTEN_LABELS} from "../../app/Pages/CreateFunctions/CreateUser";
import {logout} from "../../auth/auth_utils";

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
                            {`Welcome, ${user.getFirstName()}`}
                        </text>
                        <MDBNavbarNav right>
                            <MDBNavItem style={{marginRight: 100}}>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-menu">
                                        <MDBDropdownItem href="/"
                                                         onClick={logout}>
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