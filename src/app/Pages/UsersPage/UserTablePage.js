import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import UserRequests from "../../../controller/requests/user_requests";
import TableColumns from "../../Common/Tables/TableUtils/Columns";
import DataTable from "../../Common/Tables/DataTable";
import HTPButton from "../../Common/HTPButton";
import CreateUserPopup from "./UserFunctions/CreateUserPopup";
import {DISPLAYABLE_LABELS, SHORTEN_LABELS} from "../CreateFunctions/CreateUser";

const ADMIN_NAME = 'Admin'

class UserTablePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            userList: undefined,
            idToStaff : {},
            errors: {},
            pk: "",
            new_user: {},
            usererrors: {},
            modal : true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.getUserList()
        }, 1000);
    }

    getUserList = async() =>{
        let results = await UserRequests.getAllUsers(this.props.token)
        results = await this.userParse(results)
        this.setState({userList: results})
        return results
    }

    renderOptions = (result) => {
        return (<MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 0, xs: 2}}>
                    <HTPButton size="sm"
                               disabled={!result['is_active']}
                               color={result['is_staff'] == "admin" ? "orange" : "green"}
                               onSubmit={()=>this.changeAdminState(result['id'], this.state.idToStaff[result['id']] ? 'False' : 'True')}
                               label = {result['is_staff'] == "admin" ? "Revoke Admin Status" : "Grant Admin Status"}/>
                    <HTPButton color="red"
                               disabled={!result['is_active']}
                               size="sm" onSubmit={()=>this.deactivateUser(result['id'])}
                               label={result['is_active'] ? 'Remove user' : 'User deleted'}/>
                    <HTPButton color="orange"
                               disabled={!result['is_active']}
                               size="sm" onSubmit={()=>this.changeGroups(result['id'], ["calibration"])}
                               label={'Add Calibration'}/>
                </MDBRow>)
    }

    userParse = (results) => {
        let idToStaff = {}
        results.forEach(result => {
            if (result.hasOwnProperty("groups")) {
                let array = result["groups"]
                let newArray = []
                for (let i=0; i<array.length; i++){
                    let index = SHORTEN_LABELS.indexOf(array[i])
                    newArray.push(DISPLAYABLE_LABELS[index])
                }
                let finalArray = this.determineWhichGroupsToDisplay(newArray)
                let stringPermission = finalArray.toString()
                result["is_staff"] = stringPermission
            }
            result['options'] = result['name'] === ADMIN_NAME ? <div style={{textAlign : 'center'}}>Permanent Admin</div>
                : this.renderOptions(result, idToStaff)
        })
        this.setState({idToStaff : idToStaff})
        return results
    }

    determineWhichGroupsToDisplay = (array) => {
        return array
    }

    changeAdminState = async(pk, bool) =>{
        let dat = new FormData();
        dat.append('is_staff', bool)
        this.state.idToStaff[pk] = !this.state.idToStaff[pk]
        this.setState(this.state.idToStaff)
        let results = await UserRequests.changeAdminStatus(this.props.token, pk, dat)
        await this.getUserList()
        return results
    }

    deactivateUser = async(pk) =>{
        let result = await UserRequests.deactivateUser(this.props.token, pk);
        await this.getUserList()
        return result
    }

    changeGroups = async(pk, groupChanged) =>{
        let oldGroups = []
        let results = await UserRequests.getAllUsers(this.props.token)
        console.log(results)
        results.forEach(result => {
            if (result["id"]==pk) {
                console.log(result["groups"])
            }
        })
        let result = await UserRequests.changeGroups(this.props.token, pk, groupChanged);
        await this.getUserList()
        return result
    }

    render() {
        let {user, token} = this.props
        let {userList} = this.state
            return(<div style={{marginTop : 20, marginLeft : 100, marginRight : 100}}>
                        <div style={{display : "flex", flexDirection : "row", justifyContent : "space-between", alignItems : 'center'}}>
                            <div style={{marginLeft : -15}}>
                                <header className={"h2-responsive"} style={{marginLeft : 15, marginBottom: 10}}>
                                    {`Manage Users`}
                                </header>
                                <text className={"h5-responsive text-default"} style={{marginTop : 30, marginLeft: 15}}>{"Create users & modify permissions"}</text>
                            </div>
                            {user.is_staff && <CreateUserPopup
                                                    updatePage = {this.getUserList}
                                                    token={token}/>}
                        </div>
                            <div style={{marginTop : 10}}>
                                <DataTable
                                    disableRetreatAfterSorting
                                    token={token}
                                    columns={TableColumns.USER_COLUMNS}
                                    rows={userList}
                                />
                            </div>
                        </div>)
    }
}

export default UserTablePage