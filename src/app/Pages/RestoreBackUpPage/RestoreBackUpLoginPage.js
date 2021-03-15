import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import UserRequests from "../../../controller/requests/user_requests";
import {Gradient} from "react-gradient";
import {gradients} from "../../../utils/styling";
import {Divider} from "@material-ui/core";
import HTPPopup from "../../Common/HTPPopup";
import RestoreBackUpPage from "../../Pages/RestoreBackUpPage/RestoreBackUpPage";

class RestoreBackUpLoginPage extends Component{


    //ToDo: Make sure admin can't be deleted/edited
    constructor(props) {
        super(props);
        this.state = {
            modalBackUp : false,
            modalError : false,
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
        console.log(this.state.input.username)
        console.log(this.state.input.password)
        event.preventDefault();
        if (this.state.input.username == ('admin') && this.state.input.password == ('DukeECE458')){
            console.log('good password')
            this.toggleModalBackUp()
        }
        else{
            this.toggleModalError()
        }
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

    toggleModalBackUp = () => {
        this.setState({
            modalBackUp: !this.state.modalBackUp
        });
    }

    toggleModalError = () => {
        this.setState({
            modalError: !this.state.modalError
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
                style={{marginBottom : 100}}
                angle="45deg"
            >
                <div style={{display : 'flex', flex : 1, justifyContent: 'center', textAlign : 'center', alignItems: 'center', marginBottom: -200}}>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <h2 style={{marginTop: 100}}
                                className={"h1-responsive"}>
                                Restore Database
                            </h2>
                            <h2 className={"h4-responsive"}>
                                Enter correct credentials for restoring database
                            </h2>
                            <Divider style={{marginTop : 30}}
                                     orientation={"horizontal"}
                            />

                            <div style={{marginTop : 30}}
                                 className="form-group">
                                <label htmlFor="old_pass">Current Password</label>
                                <input
                                    name="username"
                                    ref={el => this.currPwdRef = el}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Enter username"
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
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Enter password"
                                    id="password"/>
                                <div className="text-danger">{this.state.errors.password}</div>
                            </div>
                            <MDBBtn color="dark-green"
                                    onsubmit="return false"
                                    type={"submit"}
                                    action={false}>
                                Submit
                            </MDBBtn>
                            <HTPPopup isOpen={this.state.modalBackUp}
                                      toggleModal={this.toggleModalBackUp}
                                      className={successMessage ? "text-success" : "text-danger"}
                                      title={""}
                                      message={<RestoreBackUpPage></RestoreBackUpPage>}/>
                            <HTPPopup isOpen={this.state.modalError}
                                      toggleModal={this.toggleModalError}
                                      className={successMessage ? "text-success" : "text-danger"}
                                      title={""}
                                      message={"Username and Password incorrect"}/>
                        </form>
                    </div>
                </div>
            </Gradient>
        )
    }
}
export default RestoreBackUpLoginPage


//message={<RestoreBackUpPage></RestoreBackUpPage>}/>