import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserTablePage from "./Widgets/UserTablePage";
import HTPNavBar from "../Common/HTPNavBar";
import UserSettingsPage from "./UserSettingsPage";

class UserSettingsView extends Component{



    render() {
        return(
            <div>
                <HTPNavBar
                    navbarColor={"black"}
                    user={this.props.user}
                    location={this.props.location}
                />
                <UserSettingsPage
                    user={this.props.user}
                    token={this.props.token}
                />
            </div>
        )
    }
}

export default UserSettingsView