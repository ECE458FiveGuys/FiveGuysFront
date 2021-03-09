import React from "react"
import HTPPopup from "../../../Common/HTPPopup";
import HTPButton from "../../../Common/HTPButton";
import CreateUser from "../../CreateFunctions/CreateUser";

export default class CreateUserPopup extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            modal : false
        }
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return(<div>
            <HTPButton label={"Create User"} onSubmit={this.toggleModal}></HTPButton>
                <HTPPopup isOpen={this.state.modal}
                  toggleModal={this.toggleModal}
                  className={"text-default"}
                  title={"Create User"}
                  message={<CreateUser token={this.props.token}/>}/>
                </div>)
    }
}