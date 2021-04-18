import React, { Component } from "react";
import {DISPLAYABLE_LABELS, LABELS, SHORTEN_LABELS} from "../../CreateFunctions/CreateUser";
import UserRequests from "../../../../controller/requests/user_requests";
import HTPNavBar from "../../../Common/HTPNavBar";
import UserSection from "./Sections/UserSection";
import {Button} from "react-bootstrap";
import Checkbox from "../../../Common/Tables/TableWidgets/Checkbox";
import * as PropTypes from "prop-types";
import {User} from "../../../../utils/dtos";
import HTPPopup from "../../../Common/HTPPopup";

const DIVIDER_MARGINS = 100

const PERMISSION_KEY_TO_LABEL = {
    [SHORTEN_LABELS.ADMINISTRATOR] : DISPLAYABLE_LABELS.ADMINISTRATOR,
    [SHORTEN_LABELS.CALIBRATION_APPROVER] : DISPLAYABLE_LABELS.CALIBRATION_APPROVER,
    [SHORTEN_LABELS.MODEL_MANAGEMENT] : DISPLAYABLE_LABELS.MODEL_MANAGEMENT,
    [SHORTEN_LABELS.INSTRUMENT_MANAGEMENT] : DISPLAYABLE_LABELS.INSTRUMENT_MANAGEMENT,
    [SHORTEN_LABELS.CALIBRATION] : DISPLAYABLE_LABELS.CALIBRATION,
    // [SHORTEN_LABELS.UNPRIVILEGED] : DISPLAYABLE_LABELS.UNPRIVILEGED,
}

const PERMISSIONS_TO_SUB_PERMISSIONS = {
    [SHORTEN_LABELS.ADMINISTRATOR] : [SHORTEN_LABELS.CALIBRATION_APPROVER, SHORTEN_LABELS.MODEL_MANAGEMENT],
    [SHORTEN_LABELS.CALIBRATION_APPROVER] : [SHORTEN_LABELS.CALIBRATION],
    [SHORTEN_LABELS.MODEL_MANAGEMENT] : [SHORTEN_LABELS.INSTRUMENT_MANAGEMENT]
}

const PERMISSIONS_TO_PARENT_PERMISSIONS = {
    [SHORTEN_LABELS.CALIBRATION_APPROVER] : [SHORTEN_LABELS.ADMINISTRATOR],
    [SHORTEN_LABELS.CALIBRATION] : [SHORTEN_LABELS.ADMINISTRATOR, SHORTEN_LABELS.CALIBRATION_APPROVER],
    [SHORTEN_LABELS.MODEL_MANAGEMENT] : [SHORTEN_LABELS.ADMINISTRATOR],
    [SHORTEN_LABELS.INSTRUMENT_MANAGEMENT] : [SHORTEN_LABELS.ADMINISTRATOR, SHORTEN_LABELS.MODEL_MANAGEMENT]
}

export default class UserDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.state.permissionRefMap = this.makePermissionRefMap()
    }

    componentDidMount() {
        this.loadUser()
    }

    loadUser() {
        let {token, id} = this.props
        let retrieveUserCallback = (user) => {
            this.setState({loadedUser : user});
            this.makePermissionRefMap(user)
        }
        let retrieveUserError = (e) => {
            alert("RETRIEVE ERROR:" + e)
        }
        UserRequests.retrieveUser(token, id, retrieveUserCallback, retrieveUserError);
    }

    makePermissionRefMap() {
        let permissionRefMap = new Map()
        Object.keys(PERMISSION_KEY_TO_LABEL).forEach(key => {
            permissionRefMap.set(key, React.createRef())
        })
        return permissionRefMap
    }

    updatePageState = (state) => {
        this.setState(state)
    }

    handleDelete(pk) {
        UserRequests.deactivateUser(this.props.token, pk)
        this.props.history.push("/users")
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

    renderPermissions = () => {
        let {loadedUser} = this.state
        return Object.keys(PERMISSION_KEY_TO_LABEL).map(permissionGroup => {
            return <div style={{marginRight : 20}}>
                <Checkbox handleSelect={() => this.updatePermissionArray(loadedUser.id, permissionGroup)}
                          defaultChecked={loadedUser.groups.includes(permissionGroup)}
                          label={PERMISSION_KEY_TO_LABEL[permissionGroup]}
                          ref={this.state.permissionRefMap.get(permissionGroup)}
                          id={loadedUser.id + "_" + permissionGroup}/>
            </div>
        })
    }

    toggleModal2 = () => {
        this.setState({
            modal2: !this.state.modal2
        });
    }

    addGroup(group, groupsCopy) {
        groupsCopy.push(group)
        // if (groupsCopy.includes(group)) {
        //     let i = groupsCopy.indexOf(group)
        //     groupsCopy.splice(i, 1)
        // } else {
        //     groupsCopy.push(group)
        // }
    }

    removeGroup(group, groupsCopy) {
        let i = groupsCopy.indexOf(group)
        groupsCopy.splice(i, 1)
    }

    updateSubPermissions(group, groupsCopy) {
        let {permissionRefMap} = this.state
        let checked = permissionRefMap.get(group).current.isChecked()
        let impliedPermissions = PERMISSIONS_TO_SUB_PERMISSIONS[group]
        if (impliedPermissions) impliedPermissions.forEach(subGroup => {
            let subRef = permissionRefMap.get(subGroup).current
            checked ? (!subRef.isChecked() ? subRef.check() : void(0)) :
                (subRef.isChecked() ? subRef.forceUncheck() : void(0))
            this.updateSubPermissions(subGroup, groupsCopy)
        })
        let parentPermissions = PERMISSIONS_TO_PARENT_PERMISSIONS[group]
        if (parentPermissions) parentPermissions.forEach(parent => {
                let parentRef = permissionRefMap.get(parent).current
                checked ? (void(0)) :
                    (parentRef.isChecked() ? parentRef.forceUncheck() : void(0))
            })
        checked ? this.addGroup(group, groupsCopy) : this.removeGroup(group, groupsCopy)
    }

    async updatePermissionArray(userPk, group) {
        let groupsCopy = [...this.state.loadedUser.groups]
        this.updateSubPermissions(group, groupsCopy)
        await UserRequests.changeGroups(this.props.token, userPk, groupsCopy)
        this.loadUser()
    }

    render() {
        let {loadedUser} = this.state
        let {user, location} = this.props
        if (loadedUser) {
            return (
                <div style={{height : "100%"}}>
                    <HTPNavBar user={user}
                               location={location}/>
                    <div style={{flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: 'center',
                        marginLeft: 100,
                        marginRight: 100}}>
                        <div style={{textAlign : 'center'}}>
                            <h1 style={{marginTop: 25, marginBottom: 20}}
                                className={"h1-responsive"}>
                                User Details
                            </h1>
                        </div>
                        <div style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                            <div style={{flex : 1, display : "flex", flexDirection : "column", alignItems : "center", justifyContent : 'flex-start'}}>
                                {UserSection(loadedUser)}
                                <div>
                                    <div
                                        style={{marginTop : 30, marginBottom : 30}}
                                        className={"h3-responsive"}>
                                        Permissions
                                        <i style={{marginLeft : 5, color: "blue", cursor : "pointer"}}
                                           onClick={this.toggleModal2}
                                           className="fas fa-info-circle"></i></div>
                                    </div>
                                <HTPPopup isOpen={this.state.modal2}
                                          toggleModal={this.toggleModal2}
                                          className={"text-info"}
                                          title={"User Permission Descriptions"}
                                          message={this.getDisplayMessage()}/>
                                    <div>
                                        {loadedUser.username != "admin" ? this.renderPermissions() : <text>Permanent Admin</text>}
                                    </div>
                                {loadedUser.username != "admin" &&
                                <div style={{marginTop : 30}}>
                                    <Button variant="red" size={"sm"} onClick={() => this.handleDelete(loadedUser.id)}>
                                        Delete
                                    </Button>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div/>);
        }
    }
}

UserDetailView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    history : PropTypes.object.isRequired,
    id : PropTypes.number.isRequired
}