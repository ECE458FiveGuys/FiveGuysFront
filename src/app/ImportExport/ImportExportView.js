import React, { Component } from "react";
import ExportModel from "./Widgets/ExportModel";
import ExportInstrument from "./Widgets/ExportInstrument";
import PropTypes from "prop-types";
import TabView from "../MainPage/TabView";
import {Gradient} from "react-gradient";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';


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
                <MDBContainer>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 200, xs: 2}}>
                                <ExportModel token = {this.props.token}/>
                                <ExportInstrument token = {this.props.token}/>
                    </MDBRow>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 200, xs: 2}}>
                        <ExportModel token = {this.props.token}/>
                        <ExportInstrument token = {this.props.token}/>
                    </MDBRow>

                </MDBContainer>
            </Gradient>
        );
    }
}
export default ImportExportView

TabView.propTypes = {
    token: PropTypes.string
}