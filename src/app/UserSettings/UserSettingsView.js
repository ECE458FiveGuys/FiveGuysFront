import {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserSettingsPage from "./Widgets/UserSettingsPage";

class UserSettingsView extends Component{



    render() {
        return(
            <MDBContainer>
                <UserSettingsPage token={this.props.token}/>
            </MDBContainer>
        )
    }
}

export default UserSettingsView