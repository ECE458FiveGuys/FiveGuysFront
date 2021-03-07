import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserSettingsPage from "./Widgets/UserSettingsPage";
import HTPNavBar from "../Common/HTPNavBar";

class UserSettingsView extends Component{



    render() {
        return(
            <div>
                <HTPNavBar user={this.props.user}/>
                <MDBContainer>
                    <UserSettingsPage
                        user={this.props.user}
                        token={this.props.token}
                    />
                </MDBContainer>
            </div>
        )
    }
}

export default UserSettingsView