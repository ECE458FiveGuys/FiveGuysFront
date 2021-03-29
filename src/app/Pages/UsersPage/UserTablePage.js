import React, {Component} from "react";
import {MDBBadge, MDBBtn, MDBCol, MDBContainer, MDBListGroupItem, MDBRow} from "mdbreact";
import UserRequests from "../../../controller/requests/user_requests";
import TableColumns from "../../Common/Tables/TableUtils/Columns";
import DataTable from "../../Common/Tables/DataTable";
import HTPButton from "../../Common/HTPButton";
import CreateUserPopup from "./UserFunctions/CreateUserPopup";
import {DISPLAYABLE_LABELS, LABELS, SHORTEN_LABELS} from "../CreateFunctions/CreateUser";
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";
import {EquipmentModel} from "../../../utils/ModelEnums";
import CreateModel from "../CreateFunctions/CreateModel";
import HTPPopup from "../../Common/HTPPopup";

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
            modal : true,
            dropdown:[],
            modal2 : false
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
        let currentGroupsRaw = result.groups
        let currentGroupsPretty = []
        for (let i=0; i<currentGroupsRaw.length; i++){
            if (currentGroupsRaw[i] == SHORTEN_LABELS.UNPRIVILEGED){
                currentGroupsPretty.push(DISPLAYABLE_LABELS.UNPRIVILEGED)
            }
            if (currentGroupsRaw[i] == SHORTEN_LABELS.INSTRUMENT_MANAGEMENT){
                currentGroupsPretty.push(DISPLAYABLE_LABELS.INSTRUMENT_MANAGEMENT)
            }
            if (currentGroupsRaw[i] == SHORTEN_LABELS.MODEL_MANAGEMENT){
                currentGroupsPretty.push(DISPLAYABLE_LABELS.MODEL_MANAGEMENT)
            }
            if (currentGroupsRaw[i] == SHORTEN_LABELS.CALIBRATION){
                currentGroupsPretty.push(DISPLAYABLE_LABELS.CALIBRATION)
            }
            if (currentGroupsRaw[i] == SHORTEN_LABELS.ADMINISTRATOR){
                currentGroupsPretty.push(DISPLAYABLE_LABELS.ADMINISTRATOR)
            }
        }
        return (<MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 0, xs: 2}}>
                    <HTPAutoCompleteInput multiple = {true} defaultValue={currentGroupsPretty} options = {[DISPLAYABLE_LABELS.UNPRIVILEGED, DISPLAYABLE_LABELS.INSTRUMENT_MANAGEMENT, DISPLAYABLE_LABELS.MODEL_MANAGEMENT, DISPLAYABLE_LABELS.CALIBRATION, DISPLAYABLE_LABELS.ADMINISTRATOR,]} size = {10} onChange={this.handleChange('dropdown')} placeholder={'Options...'}/>
                    <HTPButton color="green"
                               disabled={!result['is_active']}
                               size="sm" onSubmit={()=>this.permissionSubmitted(result['id'])}
                               label={'Submit Changes'}/>
                </MDBRow>)
    }


    permissionSubmitted = async(pk) =>{
        let newArrayBackEndReadable = []
        for (let i=0; i<this.state.dropdown.length; i++){
            let num = LABELS.indexOf(this.state.dropdown[i])
            if (this.state.dropdown[i] == DISPLAYABLE_LABELS.UNPRIVILEGED){
                newArrayBackEndReadable.push(SHORTEN_LABELS.UNPRIVILEGED)
            }
            if (this.state.dropdown[i] == DISPLAYABLE_LABELS.INSTRUMENT_MANAGEMENT){
                newArrayBackEndReadable.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
            }
            if (this.state.dropdown[i] == DISPLAYABLE_LABELS.MODEL_MANAGEMENT){
                newArrayBackEndReadable.push(SHORTEN_LABELS.MODEL_MANAGEMENT)
            }
            if (this.state.dropdown[i] == DISPLAYABLE_LABELS.CALIBRATION){
                newArrayBackEndReadable.push(SHORTEN_LABELS.CALIBRATION)
            }
            if (this.state.dropdown[i] == DISPLAYABLE_LABELS.ADMINISTRATOR){
                newArrayBackEndReadable.push(SHORTEN_LABELS.ADMINISTRATOR)
            }
        }
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS.ADMINISTRATOR)){
            newArrayBackEndReadable = []
            newArrayBackEndReadable.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
            newArrayBackEndReadable.push(SHORTEN_LABELS.MODEL_MANAGEMENT)
            newArrayBackEndReadable.push(SHORTEN_LABELS.CALIBRATION)
            newArrayBackEndReadable.push(SHORTEN_LABELS.ADMINISTRATOR)
        }
        if (newArrayBackEndReadable.length == 0) {
            newArrayBackEndReadable.push(SHORTEN_LABELS.UNPRIVILEGED)
        }
        if (newArrayBackEndReadable.length>1 && newArrayBackEndReadable.includes(SHORTEN_LABELS.UNPRIVILEGED)){
            newArrayBackEndReadable = newArrayBackEndReadable.filter(function(item) {
                return item !== SHORTEN_LABELS.UNPRIVILEGED
            })
        }
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && !newArrayBackEndReadable.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)){
            newArrayBackEndReadable.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
        }
        let result = await UserRequests.changeGroups(this.props.token, pk, newArrayBackEndReadable);
        await this.getUserList()
        return result
    }

    getCols() {
        let cols = TableColumns.USER_COLUMNS
        cols[4].label = <div>Change User Permission<i style={{marginLeft : 5, color: "blue"}}
                                                                    onClick={this.toggleModal2}
                                                                    className="fas fa-info-circle"></i></div>
        return cols
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
                    if (array[i]==SHORTEN_LABELS.ADMINISTRATOR){
                        newArray.push(DISPLAYABLE_LABELS.ADMINISTRATOR)
                    }
                }
                let finalArray = this.determineWhichGroupsToDisplay(newArray)

                let stringPermission = this.getCategoriesPretty(finalArray)


                result["is_staff"] = stringPermission
            }
            if (result.id !=1) {
                result['delete'] = true == true ? <HTPButton color="red"
                                                             disabled={!result['is_active']}
                                                             size="sm"
                                                             onSubmit={() => this.deactivateUser(result['id'])}
                                                             label={"X"}/>
                    : this.renderOptions(result, idToStaff)
            }
            else {
                result['delete'] = result['name'] === ADMIN_NAME ? <div style={{textAlign : 'center'}}></div>
                    : this.renderOptions(result, idToStaff)
            }
            result['options'] = result['name'] === ADMIN_NAME ? <div style={{textAlign : 'center'}}>Permanent Admin</div>
                : this.renderOptions(result, idToStaff)

        })
        this.setState({idToStaff : idToStaff})
        return results
    }

    getCategoriesPretty = (finalArray) => {
        return(
            <div>
                <MDBBadge style={{marginRight : 5}}
                                         color="green"
                                         pill>
                    {finalArray[0]}
                </MDBBadge>
                <MDBBadge style={{marginRight : 5}}
                          color="green"
                          pill>
                    {finalArray[1]}
                </MDBBadge>
                <MDBBadge style={{marginRight : 5}}
                          color="green"
                          pill>
                    {finalArray[2]}
                </MDBBadge>
                <MDBBadge style={{marginRight : 5}}
                          color="green"
                          pill>
                    {finalArray[3]}
                </MDBBadge>
            </div>

        )}


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

    handleChange=(name)=>(value)=>{
        let newState = {}
        newState[name] = value
        this.setState(newState)
    }

    changeGroups = async(pk, groupChanged) =>{
        let oldGroups = []
        let results = await UserRequests.getAllUsers(this.props.token)
        results.forEach(result => {
            if (result["id"]==pk) {
                oldGroups = result["groups"]
            }
        })
        if (!oldGroups.includes(groupChanged[0])){
            oldGroups.push(groupChanged[0])
        }
        else {
            oldGroups = oldGroups.filter(function(item) {
                return item !== groupChanged[0]
            })
        }
        if (oldGroups.length==0){
            oldGroups.push(SHORTEN_LABELS.UNPRIVILEGED)
        }
        if (oldGroups.length>1 && oldGroups.includes(SHORTEN_LABELS.UNPRIVILEGED)){
            oldGroups = oldGroups.filter(function(item) {
                return item !== SHORTEN_LABELS.UNPRIVILEGED
            })
        }
        if (oldGroups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && !oldGroups.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)){
            oldGroups.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
        }
        let result = await UserRequests.changeGroups(this.props.token, pk, oldGroups);
        await this.getUserList()
        return result
    }

    toggleModal2 = () => {
        this.setState({
            modal2: !this.state.modal2
        });
    }

    getDisplayMessage = () => {
        let displayMessage = LABELS
        return Array.isArray(displayMessage)  ? <div>
            <ul>
                {displayMessage.map(function(name, index){
                    return <li key={ index }>{name}</li>;
                })}
            </ul>
        </div> : <></>
    }

    render() {
        let {user, token} = this.props
        let cols = TableColumns.USER_COLUMNS
        let {userList} = this.state
            return(<div style={{marginTop : 20, marginLeft : 100, marginRight : 100}}>
                    <HTPPopup isOpen={this.state.modal2}
                              toggleModal={this.toggleModal2}
                              className={"text-info"}
                              title={"User Permission Descriptions"}
                              message={this.getDisplayMessage()}/>
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
                                    disableRetreatAfterSorting={true}
                                    token={token}
                                    columns={this.getCols()}
                                    rows={userList}
                                />
                            </div>
                        </div>)
    }
}

export default UserTablePage