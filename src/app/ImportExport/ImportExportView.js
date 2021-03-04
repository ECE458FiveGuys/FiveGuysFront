import React, { Component } from "react";
import ExportModel from "./Widgets/ExportModel";
import ExportInstrument from "./Widgets/ExportInstrument";
import PropTypes from "prop-types";
import {Gradient} from "react-gradient";
import {MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu} from 'mdbreact';
import CSV_Import from "./Widgets/CSV_Import";
import NavBar from "../Common/HTPNavBar";


const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];


class ImportExportView extends Component{

    render(){
        return (
            <Gradient
                className={"fill-window"}
                gradients={ gradients } // required
                property="background"
                duration={ 3000 }
                angle="45deg"
            >
                <NavBar user={this.props.user}/>
                <MDBContainer>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 200, xs: 2}}>
                        <ExportModel token = {this.props.token}/>
                        <ExportInstrument token = {this.props.token}/>
                    </MDBRow>
                    <CSV_Import token = {this.props.token}/>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 20, xs: 2}}>
                        To Import: Select File, then Select Import Type From Dropdown
                    </MDBRow>
                </MDBContainer>
            </Gradient>
        );
    }
}
export default ImportExportView

ImportExportView.propTypes = {
    token: PropTypes.string
}