import React, { Component } from "react";
import PropTypes from "prop-types";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import {METHODS, URLS} from "../../../controller/strings";
import ModelFields from "../../../utils/enums";
import {User} from "../../../utils/dtos";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../Common/Inputs/HTPInput";
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import HTPPopup from "../../Common/HTPPopup";
import CreateModel from "./CreateModel";
import {Button} from "react-bootstrap";
import InstrumentRequests from "../../../controller/requests/instrument_requests";


class TempPage extends Component {

    constructor(props) {
        super(props)
        this.state = {modal : false, requestStatus : "Create Model", displayMessage : "hi"}

        let editCallBack = (response) => {
            this.toggleSuccessModal()
        }
    }


    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }


    render(){
        return(
            <div>
                <Button variant="green" onClick={() => this.toggleModal()}>
                    Create
                </Button>
                <HTPPopup isOpen={this.state.modal}
                          toggleModal={this.toggleModal}
                          className={"text-info"}
                          title={this.state.requestStatus}
                          message={<CreateModel token={this.props.token} user={this.props.user}></CreateModel>}/>
            </div>
        )
    }
}

TempPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired
}

export default TempPage;