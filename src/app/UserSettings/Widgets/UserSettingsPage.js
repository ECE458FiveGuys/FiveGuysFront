import {Component} from "react";
import {MDBContainer, MDBRow} from "mdbreact";
import DatatableEditable from "../../Common/Tables/DatatableEditable";
import UserRequests from "../../../controller/requests/user_requests";

class UserSettingsPage extends Component{


    //ToDo: Make sure admin can't be deleted/edited
    constructor(props) {
        super(props);
        this.state = {
            userList: []
        }
    }


    getUserList(){
        let userlist = UserRequests.getAllUsers()
        this.setState({userList: userlist})
    }


    deactivate(){

    }


    render() {
        const {userList} = this.state

        return(
            <MDBContainer>
                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                    <DatatableEditable
                        token={this.props.token}
                        columns={}
                        rows={userList}
                        editableColumns={}
                        editFunction={}
                        createFunction={}
                        deleteFunction={}>
                    </DatatableEditable>

                </MDBRow>
            </MDBContainer>
        )
    }
}

export default UserSettingsPage