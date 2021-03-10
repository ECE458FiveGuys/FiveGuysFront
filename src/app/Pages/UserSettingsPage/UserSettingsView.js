import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserTablePage from "../UsersPage/UserTablePage";
import HTPNavBar from "../../Common/HTPNavBar";
import UserSettingsPage from "./UserSettingsPage";

class UserSettingsView extends Component{



    render() {
        return(
            <div>
                <div style={{position : 'absolute', zIndex : 1, width : '100%'}}>
                    <HTPNavBar
                        navbarColor={"black"}
                        user={this.props.user}
                        location={this.props.location}
                    />
                </div>
                <UserSettingsPage
                    user={this.props.user}
                    token={this.props.token}
                />
            </div>
        )
    }
}

export default UserSettingsView