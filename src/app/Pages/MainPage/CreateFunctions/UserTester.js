import React, { Component } from "react";
import PropTypes from "prop-types";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import {METHODS, URLS} from "../../../../controller/strings";
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../../Common/Inputs/HTPInput";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import UserRequests from "../../../../controller/requests/user_requests";
import HTPPopup from "../../../Common/HTPPopup";
import CreateModel from "./CreateModel";
import {Button} from "react-bootstrap";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";


class TempPage extends Component {

    constructor(props) {
        super(props)
        this.state = {modal : false, requestStatus : "Create Model", displayMessage : "hi"}
    }


    addUser = () => {

        let createUserCallBack = (returnArray) => {
            this.setState({resultsOfAddUser: returnArray})
            console.log(this.state.resultsOfAddUser)
        }
        UserRequests.addUser(this.props.token, "newguyName123122", "newguyUserName13122", "newguyEmail@duke.edu",
            "newguyPassword", createUserCallBack)
    }


    render(){
        let text = this.state.resultsOfAddUser
        return(
            <div>
                <Button variant="green" onClick={() => this.addUser()}>
                    Create
                </Button>
                {text}
            </div>
        )
    }
}

TempPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired
}

export default TempPage;