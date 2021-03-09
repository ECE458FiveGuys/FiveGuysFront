import React, {Component} from "react";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import DatatableEditable from "../../Common/Tables/DatatableEditable";
import UserRequests from "../../../controller/requests/user_requests";
import ModelFields from "../../../utils/enums";
import TableUtils from "../../Pages/MainPage/InventoryTables/TableUtils";
import TableColumns from "../../Pages/MainPage/InventoryTables/Columns";
import DataTable from "../../Common/Tables/DataTable";
import HTPButton from "../../Common/HTPButton";

let adminName = 'Admin'

class UserSettingsPage extends Component{


    //ToDo: Make sure admin can't be deleted/edited
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            input: {},
            errors: {},
            new_pass: "",
            pk: "",
            new_user: {},
            usererrors: {},

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeUser = this.makeUser.bind(this);
    }

    handleInputChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    handleUserChange(event) {
        let new_user = this.state.new_user;
        new_user[event.target.name] = event.target.value;

        this.setState({
            new_user
        });
    }

    validateUser() {
        let input = this.state.new_user;
        let errors = {};
        let isValid = true;

        if (!input["name"]) {
            isValid = false;
            errors["name"] = "Please enter your name.";
        }

        if (!input["email"]) {
            isValid = false;
            errors["email"] = "Please enter your email Address.";
        }

        if (typeof input["email"] !== "undefined") {

            let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(input["email"])) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }

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
        return isValid
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.validate()){
            console.log(this.state);

            this.setState({new_pass: this.state.input.password})
            let result = this.submitPassword()

            let input = {};
            input["old_pass"] = ""
            input["password"] = "";
            input["confirm_password"] = "";
            this.setState({input:input});

            //alert('Password Change Submitted');
        }
        else{
            alert("Invalid Password")
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

    getUserList = async() =>{
        let results = await UserRequests.getAllUsers(this.props.token)
        results = await this.userParse(results)
        this.setState({userList: results})
        return results
    }

    userParse = (results) => {
        console.log(results)
        results.forEach(result => {
            if(result['is_active'] === true){
                result['is_active'] = 'True'
            }
            else {
                result['is_active'] = 'False'
            }
            if(result['is_staff'] === true){
                if(result['name']!==adminName){
                    result['is_staff'] = (
                        <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 0, xs: 2}}>
                            <HTPButton onSubmit={()=>this.changeAdminState(result['id'], 'False')} label ='Revoke Admin Status'></HTPButton>
                            <HTPButton onSubmit={()=>this.deactivateUser(result['id'])} label='Delete'></HTPButton>
                        </MDBRow>)
                }
                else{
                    result['is_staff'] = 'Permanent Admin'
                }
            }
            else{
                result['is_staff'] = (
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 0, xs: 2}}>
                        <HTPButton onSubmit={()=>this.changeAdminState(result['id'], 'True')} label='Grant Admin Status'></HTPButton>
                        <HTPButton onSubmit={()=>this.deactivateUser(result['id'])} label='Delete'></HTPButton>
                    </MDBRow>)
            }
        })
        console.log(results)
        return results
    }

    makeUser = async(event) =>{
        event.preventDefault()
        if(this.validateUser()){
            let result = await UserRequests.addUser(this.props.token, this.state.new_user.name,
                this.state.new_user.username, this.state.new_user.email, this.state.new_user.password)

            let new_user = {};
            new_user["name"] = ""
            new_user["username"] = ""
            new_user["email"] = ""
            new_user["password"] = "";
            new_user["confirm_password"] = "";
            this.setState({new_user:new_user});
            alert(result)
            await this.getUserList()
        }
        else{
            alert("Invalid Input")
        }
    }

    changeAdminState = async(pk, bool) =>{
        let dat = new FormData;
        dat.append('is_staff', bool)
        let results = await UserRequests.changeAdminStatus(this.props.token, pk, dat)
        await this.getUserList()
        return results
    }

    deactivateUser = async(pk) =>{
        let result = await UserRequests.deactivateUser(this.props.token, pk);
        console.log(result)
        await this.getUserList()
        return result
    }

    submitPassword = async() =>{
        let dat = new FormData
        dat.append("new_password", this.state.input.password)
        dat.append("re_new_password", this.state.input.password)
        dat.append("current_password", this.state.input.old_pass)

        let result = await UserRequests.passwordChange(this.props.token,dat)
        return result
    }

    componentDidMount() {
        setTimeout(() => {
            this.getUserList()
        }, 1000);
    }

    render() {
        const {userList} = this.state
        let {user} = this.props
        let datatable = []
        if(user.is_staff)
        {
            datatable.push(
                <DataTable
                    token={this.props.token}
                    columns={TableColumns.USER_COLUMNS}
                    rows={userList}
                >
                </DataTable>
            )
        }

        let createUser = []
        if(user.is_staff){
            createUser.push(
                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                        <h2>Create User:</h2>
                    </MDBRow>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2, }}>
                        <div>
                            <form onSubmit={this.makeUser}>
                                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 0, xs: 2, }}>
                                    <MDBCol>
                                        <input
                                            type="text"
                                            name="name"
                                            value={this.state.new_user.name}
                                            onChange={this.handleUserChange}
                                            className="form-control"
                                            placeholder="Name"
                                            id="name"/>
                                        <div className="text-danger">{this.state.usererrors.name}</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <input
                                            type="text"
                                            name="username"
                                            value={this.state.new_user.username}
                                            onChange={this.handleUserChange}
                                            className="form-control"
                                            placeholder="Username"
                                            id="new_username"/>
                                        <div className="text-danger">{this.state.usererrors.username}</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <input
                                            type="text"
                                            name="email"
                                            value={this.state.new_user.email}
                                            onChange={this.handleUserChange}
                                            className="form-control"
                                            placeholder="Email"
                                            id="email"/>
                                        <div className="text-danger">{this.state.usererrors.email}</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <input
                                            type="password"
                                            name="password"
                                            value={this.state.new_user.password}
                                            onChange={this.handleUserChange}
                                            className="form-control"
                                            placeholder="Password"
                                            id="new_user_password"/>
                                        <div className="text-danger">{this.state.usererrors.password}</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={this.state.new_user.confirm_password}
                                            onChange={this.handleUserChange}
                                            className="form-control"
                                            placeholder="Confirm Password"
                                            id="new_confirm_password"/>
                                        <div className="text-danger">{this.state.usererrors.confirm_password}</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <HTPButton onSubmit={this.makeUser} label='Create User'/>
                                    </MDBCol>
                                </MDBRow>
                            </form>
                        </div>
                    </MDBRow>
                </MDBRow>

        )
        }

        return(
                <MDBContainer fluid>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                        <form onSubmit={this.handleSubmit}>
                            <h2>Password Reset:</h2>
                            <div className="form-group">
                                <label htmlFor="old_pass">Old Password:</label>
                                <input
                                    type="password"
                                    name="old_pass"
                                    value={this.state.input.old_pass}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Enter old password"
                                    id="old_pass"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">New Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={this.state.input.password}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Enter new password"
                                    id="password"/>
                                <div className="text-danger">{this.state.errors.password}</div>
                            </div>
                                <div className="form-group">
                                    <label htmlFor="password">Confirm New Password:</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={this.state.input.confirm_password}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Confirm new password"
                                        id="confirm_password"/>
                                    <div className="text-danger">{this.state.errors.confirm_password}</div>
                                </div>
                            <input type="submit" value="Submit" className="btn btn-success"/>
                        </form>
                        </MDBRow>
                    <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                        <h2>User Table:</h2>

                    </MDBRow>
                    <MDBContainer>
                        {datatable}
                    </MDBContainer>
                </MDBContainer>
        )
    }
}

export default UserSettingsPage