import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import UserRequests from "../../../controller/requests/user_requests";
import TableColumns from "../MainPage/InventoryTables/Columns";
import DataTable from "../../Common/Tables/DataTable";
import HTPButton from "../../Common/HTPButton";
import HTPPopup from "../../Common/HTPPopup";
import {Divider} from "@material-ui/core";
import CreateUserPopup from "./UserFunctions/CreateUserPopup";

const ADMIN_NAME = 'Admin'

class UserTablePage extends Component{


    //ToDo: Make sure admin can't be deleted/edited
    constructor(props) {
        super(props);
        this.state = {
            userList: undefined,
            errors: {},
            pk: "",
            new_user: {},
            usererrors: {}
        }
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

    getUserList = async() =>{
        let results = await UserRequests.getAllUsers(this.props.token)
        results = await this.userParse(results)
        this.setState({userList: results})
        return results
    }

    userParse = (results) => {
        results.forEach(result => {
            result['is_staff'] = result['name'] === ADMIN_NAME ? <div style={{textAlign : 'center'}}>Permanent Admin</div>
                                        :
                                        <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 0, xs: 2}}>
                                            <HTPButton size="sm"
                                                       disabled={!result['is_active']}
                                                       color={result['is_staff'] ? "orange" : "green"}
                                                       onSubmit={()=>this.changeAdminState(result['id'], result['is_staff'] ? 'False' : 'True')}
                                                       label = {result['is_staff'] ? "Revoke Admin Status" : "Grant Admin Status"}/>
                                            <HTPButton color="red"
                                                       disabled={!result['is_active']}
                                                       size="sm" onSubmit={()=>this.deactivateUser(result['id'])}
                                                       label={result['is_active'] ? 'Remove user' : 'User deleted'}/>
                                        </MDBRow>
        })
        return results
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
        await this.getUserList()
        return result
    }

    componentDidMount() {
        setTimeout(() => {
            this.getUserList()
        }, 1000);
    }

    render() {
        let {user, token} = this.props
        let {userList} = this.state
            return(<div style={{marginTop : 30, marginLeft : 100, marginRight : 100}}>
                    <div style={{display : "flex", flexDirection : "row", justifyContent : "space-between", alignItems : 'center'}}>
                        <div style={{marginLeft : -15}}>
                            <header className={"h2-responsive"} style={{marginLeft : 15, marginBottom: 10}}>
                                {`Manage Users`}
                            </header>
                            <text className={"h5-responsive text-default"} style={{marginTop : 30, marginLeft: 15}}>{"Create users & modify permissions"}</text>
                        </div>
                        {user.is_staff && <CreateUserPopup token={token}/>}
                    </div>
                        <div style={{marginTop : 20}}>
                            <DataTable
                                token={token}
                                columns={TableColumns.USER_COLUMNS}
                                rows={userList}
                            >
                            </DataTable>
                        </div>
                    </div>)
    }
}

export default UserTablePage