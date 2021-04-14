import React, {Component} from "react";
import {MDBBadge, MDBBtn, MDBCol, MDBContainer, MDBListGroupItem, MDBRow} from "mdbreact";
import UserRequests from "../../../controller/requests/user_requests";
import TableColumns from "../../Common/Tables/TableUtils/Columns";
import DataTable from "../../Common/Tables/DataTable";
import HTPButton from "../../Common/HTPButton";
import CreateUserPopup from "./UserFunctions/CreateUserPopup";
import {DISPLAYABLE_LABELS, LABELS, SHORTEN_LABELS} from "../CreateFunctions/CreateUser";
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";
import HTPPopup from "../../Common/HTPPopup";
import Checkbox from "../../Common/Tables/TableWidgets/Checkbox";
import {handleNavClick} from "../../utils";

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
            modal : true,
            dropdown:[],
            modal2 : false,
            userPermissions: new Map()
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

    userParse = (results) => {
        let newResults = []
        results.forEach(result => {
            if (result.is_active) {
                newResults.push(result)
            }
        })
        results = newResults
        let idToStaff = {}
        results.forEach(result => {
            if (result.hasOwnProperty("groups") && result.is_active) {
                let array = result["groups"]
                array = this.determineWhichGroupsToDisplay(array)
                let newArray = []
                for (let i=0; i<array.length; i++){
                    if (array[i]==SHORTEN_LABELS.INSTRUMENT_MANAGEMENT){
                        newArray.push(DISPLAYABLE_LABELS.INSTRUMENT_MANAGEMENT)
                    }
                    if (array[i]==SHORTEN_LABELS.MODEL_MANAGEMENT){
                        newArray.push(DISPLAYABLE_LABELS.MODEL_MANAGEMENT)
                    }
                    if (array[i]==SHORTEN_LABELS.CALIBRATION){
                        newArray.push(DISPLAYABLE_LABELS.CALIBRATION)
                    }
                    if (array[i]==SHORTEN_LABELS.CALIBRATION_APPROVER){
                        newArray.push(DISPLAYABLE_LABELS.CALIBRATION_APPROVER)
                    }
                    if (array[i]==SHORTEN_LABELS.ADMINISTRATOR){
                        newArray.push(DISPLAYABLE_LABELS.ADMINISTRATOR)
                    }
                }
                let stringPermission = this.getCategoriesPretty(newArray)

                result["is_staff"] = stringPermission
            }
            result.clickEvent = () => handleNavClick("/user-view/" + result.id, this.props.history)
        })
        this.setState({idToStaff : idToStaff})
        return results
    }

    getCategoriesPretty = (finalArray) => {
        let index = 0
        return (finalArray.map(value => {
                index = index + 1
                return <MDBBadge style={{marginRight : 5}}
                                                     color="green"
                                                     pill>
                            {finalArray[index - 1]}
                            </MDBBadge>})
        )}


    determineWhichGroupsToDisplay = (array) => {
        if (array.includes(SHORTEN_LABELS.ADMINISTRATOR)) return [SHORTEN_LABELS.ADMINISTRATOR]
        if (array.includes(SHORTEN_LABELS.CALIBRATION_APPROVER) && array.includes(SHORTEN_LABELS.CALIBRATION)) {
            array.splice(array.indexOf(SHORTEN_LABELS.CALIBRATION), 1)
        }
        if (array.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && array.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)) {
            array.splice(array.indexOf(SHORTEN_LABELS.MODEL_MANAGEMENT), 1)
        }
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

    handleChange=(name)=>(value)=>{
        let newState = {}
        newState[name] = value
        this.setState(newState)
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
                            {user.groups.includes(SHORTEN_LABELS.ADMINISTRATOR) && <CreateUserPopup
                                                    updatePage = {this.getUserList}
                                                    token={token}/>}
                        </div>
                            <div style={{marginTop : 10}}>
                                <DataTable
                                    disableRetreatAfterSorting={true}
                                    token={token}
                                    columns={TableColumns.USER_COLUMNS}
                                    rows={userList}
                                />
                            </div>
                        </div>)
    }
}

export default UserTablePage