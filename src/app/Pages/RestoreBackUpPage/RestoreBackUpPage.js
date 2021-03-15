import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import UserRequests from "../../../controller/requests/user_requests";
import {Gradient} from "react-gradient";
import {gradients} from "../../../utils/styling";
import {Divider} from "@material-ui/core";
import HTPPopup from "../../Common/HTPPopup";
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";

class RestoreBackUpPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modal : false,
            input: {},
            errors: {},
            new_pass: "",
            pk: "",
            new_user: {},
            usererrors: {},

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    handleSubmit(event) {
        console.log(this.state.input.username)
        console.log(this.state.input.password)
        event.preventDefault();
        if (this.state.input.username.equals('admin')&&this.state.input.password.equals('DukeECE458')){
            console.log('good')
        }
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {successMessage, errorMessage, modal} = this.state
        return(
            <div>
                    <div>
                        <div></div>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <HTPAutoCompleteInput options = {['1 Day', '1 week', '1 year']} label={'How many days ago would you like to restore?'} size = {15} placeholder={"Enter date to restore"}/>
                            </div>
                            <MDBBtn color="dark-green"
                                    onsubmit="return false"
                                    type={"submit"}
                                    action={false}>
                                Submit
                            </MDBBtn>
                        </form>
                    </div>
                </div>
        )
    }
}

export default RestoreBackUpPage