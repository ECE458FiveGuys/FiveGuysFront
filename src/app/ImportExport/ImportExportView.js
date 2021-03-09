import React, { Component } from "react";
import ExportModel from "./Widgets/ExportModel";
import ExportInstrument from "./Widgets/ExportInstrument";
import PropTypes from "prop-types";
import {Gradient} from "react-gradient";
import {MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu} from 'mdbreact';
import CSV_Import from "./Widgets/CSV_Import";
import HTPNavBar from "../Common/HTPNavBar";
import UserTablePage from "../UserSettings/Widgets/UserTablePage";


const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];



class ImportExportView extends Component{


render(){

    let imp = []
    if(this.props.user.is_staff){
        imp.push(
            <CSV_Import token = {this.props.token}/>
        )
    }
        return (
            <Gradient
                className={"fill-window"}
                gradients={ gradients } // required
                property="background"
                duration={ 3000 }
                angle="45deg"
            >
                <HTPNavBar
                    user={this.props.user}
                    location={this.props.location}
                />
                <MDBContainer>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 200, xs: 2}}>
                        <ExportModel token = {this.props.token}/>
                        <ExportInstrument token = {this.props.token}/>
                    </MDBRow>
                    {imp}
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 20, xs: 2}}>
                        To Import: Select File, then Select Import Type
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