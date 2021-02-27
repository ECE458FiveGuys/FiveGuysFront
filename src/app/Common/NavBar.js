import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import {StorageKeys} from "../../utils/enums";
import PropTypes from "prop-types";
import {User} from "../../utils/dtos";

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
        let {user} = this.props
        let Buttons = []
        if (user.is_staff) {
            Buttons.push(<MDBNavItem>
                            <MDBNavLink to="/create-model">Create Model</MDBNavLink>
                        </MDBNavItem>)
            Buttons.push(<MDBNavItem>
                            <MDBNavLink to="/create-instrument">Create Instrument</MDBNavLink>
                         </MDBNavItem>)
            Buttons.push(<MDBNavItem>
                <MDBNavLink to="/categories">Categories</MDBNavLink>
            </MDBNavItem>)
        }
        Buttons.push(<MDBNavItem>
                        <MDBNavLink to="/importExport">{user.is_staff ? "Import/Export" : "Export"}</MDBNavLink>
                    </MDBNavItem>)
        Buttons.push(<MDBNavItem>
            <MDBNavLink to="/load-bank">Load Bank</MDBNavLink>
        </MDBNavItem>)
        return (
                <MDBNavbar color={"green"} dark expand="md">
                    <MDBNavbarBrand>
                        <strong className="white-text">HPT</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active>
                                <MDBNavLink to="/">Home</MDBNavLink>
                            </MDBNavItem>
                            {Buttons}
                        </MDBNavbarNav>
                        <text className={"white-text"} style={{position: "absolute", left: this.state.width / 2}}>
                            {`Welcome, ${user.name}`}
                        </text>
                        <MDBNavbarNav right>
                            <MDBNavItem style={{marginRight: 100}}>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-menu">
                                        <MDBDropdownItem href="/"
                                                         onClick={()=> {
                                                             localStorage.removeItem(StorageKeys.TOKEN)
                                                             localStorage.removeItem(StorageKeys.USER)
                                                         }}>
                                            Logout
                                        </MDBDropdownItem>
                                        <MDBDropdownItem href="/settings">User Settings</MDBDropdownItem>
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
    user : PropTypes.instanceOf(User).isRequired
}