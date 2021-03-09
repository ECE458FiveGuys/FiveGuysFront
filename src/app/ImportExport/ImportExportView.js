import React, { Component } from "react";
import ExportModel from "./Widgets/ExportModel";
import ExportInstrument from "./Widgets/ExportInstrument";
import PropTypes from "prop-types";
import {Gradient} from "react-gradient";
import {MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu} from 'mdbreact';
import CSV_Import from "./Widgets/CSV_Import";
import HTPNavBar from "../Common/HTPNavBar";
import UserTablePage from "../Pages/UsersPage/UserTablePage";
import {Divider} from "@material-ui/core";


const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];



class ImportExportView extends Component{


render(){
    let {user, token, location} = this.props
    let imp = []
        if (user.is_staff) {
            imp.push(
                <CSV_Import token = {token}/>
            )
        }
        return (
            <div>
                <HTPNavBar
                    user={user}
                    location={location}
                />
                <div style={{flex : 1, display : "flex", flexDirection : 'column', justifyContent : 'center', alignItems :'center', textAlign: 'center', marginTop : 30}}>
                    <h1 className={"h1-responsive"}>
                        {user.is_staff ? "Imports & Exports" : "Export Inventory"}
                    </h1>
                    <h1 className={"h4-responsive"}
                        style={{marginTop : 20}}
                    >
                        {user.is_staff ? "Import or export instruments or models here" : "Export instruments and models here"}
                    </h1>
                            <Divider horizontal={true} style={{width : 300, marginTop : 20, marginBottom : 20}}/>
                            <h1 className={"h3-responsive"}>Exports</h1>
                            <div style={{display: "flex", flexDirection : "row", marginTop : 15}}>
                                <ExportModel token = {token}/>
                                <ExportInstrument token = {token}/>
                            </div>
                            <h1 style={{marginTop : 30}} className={"h3-responsive"}>Imports</h1>
                        {imp}
                        <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 20, xs: 2}}>
                            To Import: Select File, then Select Import Type
                        </MDBRow>
                </div>
            </div>
        );
    }
}
export default ImportExportView

ImportExportView.propTypes = {
    token: PropTypes.string
}