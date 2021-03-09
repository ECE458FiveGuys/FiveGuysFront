import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import UserRequests from "../../controller/requests/user_requests";
import {Gradient} from "react-gradient";
import {gradients} from "../../utils/styling";
import {Divider} from "@material-ui/core";
import HTPPopup from "../Common/HTPPopup";

class UserSettingsPage extends Component{


    //ToDo: Make sure admin can't be deleted/edited
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

    refreshPage() {
        let input = {};
        input["old_pass"] = ""
        input["password"] = "";
        input["confirm_password"] = "";
        this.newPwdRef.value = ""
        this.confPwdRef.value = ""
        this.currPwdRef.value = ""
        this.setState({input : input});
    }

    validate(){
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (!input["old_pass"]) {
            isValid = false;
            errors["old_pass"] = "Please enter your current password.";
        }

        if (!input["password"]) {
            isValid = false;
            errors["password"] = "Please enter your new password.";
        }

        if (!input["confirm_password"]) {
            isValid = false;
            errors["confirm_password"] = "Please enter your confirm password.";
        }

        if (typeof input["password"] !== "undefined" && typeof input["confirm_password"] !== "undefined") {

            if (input["password"] != input["confirm_password"]) {
                isValid = false;
                errors["password"] = "Passwords don't match.";
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({errorMessage : false, successMessage : false}, () => {
            if (this.validate()) {
                this.setState({new_pass: this.state.input.password})
                let result = this.submitPassword()
            }
        })
    }

    submitPassword = async() =>{
        let dat = new FormData()
        dat.append("new_password", this.state.input.password)
        dat.append("re_new_password", this.state.input.password)
        dat.append("current_password", this.state.input.old_pass)

        let callBack = (json) => {
            this.setState({successMessage : "Password changed successfully!"} , this.toggleModal)
            this.refreshPage()
        }

        let errorCallBack = (error) => {
            this.setState({errorMessage : error} , this.toggleModal)
            this.refreshPage()
        }

        UserRequests.passwordChange(this.props.token, dat, callBack, errorCallBack)
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {successMessage, errorMessage, modal} = this.state
        return(
            <Gradient
                className={"fill-window"}
                gradients={ gradients } // required
                property="background"
                duration={ 3000 }
                angle="45deg"
            >
            <MDBContainer fluid>
                <MDBRow style={{display : 'flex', flex : 1, justifyContent: 'center', textAlign : 'center', alignItems: 'center', marginTop: 100}}>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <h2 className={"h1-responsive"}>
                                Your Settings
                            </h2>
                            <h2 className={"h4-responsive"}>
                                Configure your personal settings here
                            </h2>
                            <Divider style={{marginTop : 30}}
                                     orientation={"horizontal"}
                                     />
                            <h2 style={{marginTop : 30}}
                                className={"h4-responsive"}>
                                Change your password?
                            </h2>

                            <div style={{marginTop : 30}}
                                className="form-group">
                                <label htmlFor="old_pass">Current Password</label>
                                <input
                                    type="password"
                                    name="old_pass"
                                    ref={el => this.currPwdRef = el}
                                    // value={this.state.input.old_pass}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Enter old password"
                                    id="old_pass"/>
                                <div className="text-danger">{this.state.errors.old_pass}</div>
                            </div>
                            <div
                                className="form-group">
                                <label htmlFor="password">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    ref={el => this.newPwdRef = el}
                                    // value={this.state.input.password}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Enter new password"
                                    id="password"/>
                                <div className="text-danger">{this.state.errors.password}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Confirm New Password</label>
                                <input
                                    ref={el => this.confPwdRef = el}
                                    type="password"
                                    name="confirm_password"
                                    // value={this.state.input.confirm_password}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Confirm new password"
                                    id="confirm_password"/>
                                <div className="text-danger">{this.state.errors.confirm_password}</div>
                            </div>
                            <MDBBtn color="dark-green"
                                    onsubmit="return false"
                                    type={"submit"}
                                    action={false}>
                                Submit
                            </MDBBtn>
                            <HTPPopup isOpen={modal}
                                      toggleModal={this.toggleModal}
                                      className={successMessage ? "text-success" : "text-danger"}
                                      title={successMessage ? "Success!" : "Error!"}
                                      message={successMessage ? successMessage : errorMessage}/>
                        </form>
                    </div>
                </MDBRow>
            </MDBContainer>
            </Gradient>
        )
    }
}

export default UserSettingsPage