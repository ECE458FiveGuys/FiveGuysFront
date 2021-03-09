import React from "react"
import HTPPopup from "../../../Common/HTPPopup";
import HTPButton from "../../../Common/HTPButton";
import CreateUser from "../../CreateFunctions/CreateUser";

export default class CreateUserPopup extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            modal : false,
            successModal : false
        }
    }

    toggleSuccessModal = () => {
        this.setState({
            successModal: !this.state.successModal
        }, () => {
            if (!this.state.modal) this.setState({successMessage : undefined})
        })
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    onCreateSuccess = (successMessage) => {
        this.toggleModal()
        this.props.updatePage(successMessage)
        this.toggleSuccessModal()
    }

    render() {
        return(<div>
            <HTPButton label={"Create User"} onSubmit={this.toggleModal}></HTPButton>
                <HTPPopup isOpen={this.state.modal}
                  toggleModal={this.toggleModal}
                  className={"text-default"}
                  title={"Create User"}
                  message={<CreateUser
                      updatePage={this.onCreateSuccess}
                      token={this.props.token}/>}/>
                <HTPPopup isOpen={this.state.successModal}
                          toggleModal={this.toggleSuccessModal}
                          className={"text-success"}
                          title={"Success!"}
                          message={"The user was created successfully!"}/>
                </div>

        )
    }
}