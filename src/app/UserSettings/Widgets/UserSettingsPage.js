import React, {Component} from "react";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import DatatableEditable from "../../Common/Tables/DatatableEditable";
import UserRequests from "../../../controller/requests/user_requests";
import ModelFields from "../../../utils/enums";
import TableUtils from "../../Pages/MainPage/InventoryTables/TableUtils";
import {newTab} from "../../utils";
import TableColumns from "../../Pages/MainPage/InventoryTables/Columns";
import NavBar from "../../Common/NavBar";
import {Gradient} from "react-gradient";
import {TextField} from "@material-ui/core";

class UserSettingsPage extends Component{


    //ToDo: Make sure admin can't be deleted/edited
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            input: {},
            errors: {},
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.validate()){
            console.log(this.state);

            let input = {};
            input["password"] = "";
            input["confirm_password"] = "";
            this.setState({input:input});

            alert('Password Change Submitted');
        }
    }

    validate(){
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (!input["password"]) {
            isValid = false;
            errors["password"] = "Please enter your password.";
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


    getUserList = async() => {
        let result = UserRequests.getAllUsers(this.props.token)
        result = await this.userParse(result)
        this.setState({userList: result})
    }

    userParse = (results) => {
        results.forEach(result => {
            result[ModelFields.UserFields.USER_CATEGORIES] =
                TableUtils.categoriesToString(result[ModelFields.UserFields.USER_CATEGORIES])
        })
        return results
    }

    makeUser(){

    }

    changeAdminState(){

    }

    deactivate(){

    }


    render() {
        const {userList} = this.state
        let {user} = this.props
        let datatable = []
        if(user.is_staff){
            datatable.push(
                <DatatableEditable
                    token={this.props.token}
                    columns={TableColumns.USER_COLUMNS}
                    rows={userList}
                    editableColumns={TableColumns.USER_COLUMNS_EDITABLE}
                    editFunction={this.changeAdminState}
                    createFunction={this.makeUser}
                    deleteFunction={this.deactivate}>
                </DatatableEditable>
            )
        }

        return(
            <div>
                <MDBContainer>
                    <MDBCol style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                        <form onSubmit={this.handleSubmit}>
                            <h1>Password Reset:</h1>
                            <div className="form-group">
                                    <label htmlFor="password">New Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={this.state.input.password}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        placeholder="Enter password"
                                        id="password"/>
                                    <div className="text-danger">{this.state.errors.password}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Confirm New Password:</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={this.state.input.confirm_password}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        placeholder="Enter confirm password"
                                        id="confirm_password"/>
                                </div>
                            <input type="submit" value="Submit" className="btn btn-success"/>
                        </form>
                        </MDBCol>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                        <h2>User Table:</h2>
                        {datatable}
                    </MDBRow>
                </MDBContainer>
            </div>
        )
    }
}

export default UserSettingsPage