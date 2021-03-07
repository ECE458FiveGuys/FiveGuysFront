import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import {METHODS, URLS} from "../../../../controller/strings";
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import NavBar from "../../../Common/HTPNavBar";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../../Common/Inputs/HTPInput";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import HTPPopup from "../../../Common/HTPPopup";
import CreateUser from "./CreateUser";


class TempPage extends Component {

    constructor(props) {
        super(props)
        this.state = {modal : true, requestStatus : "Create User", displayMessage : "hi"}
    }


    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render(){
        return(
            <div>
                <NavBar user={this.props.user}/>
                <MDBContainer>
                    <HTPPopup isOpen={this.state.modal}
                              toggleModal={this.toggleModal}
                              className={"text-info"}
                              title={this.state.requestStatus}
                              message={<CreateUser token={this.props.token} user={this.props.user}></CreateUser>}/>
                </MDBContainer>
            </div>
        )
    }
}

TempPage.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired
}

export default TempPage;