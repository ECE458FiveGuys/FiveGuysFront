import React, { Component } from "react";
import PropTypes from "prop-types";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import ModelFields from "../../../utils/enums";
import {User} from "../../../utils/dtos";
import NavBar from "../../Common/HTPNavBar";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../Common/Inputs/HTPInput";
import {AUTH_URLS, URLS} from "../../../controller/strings";
import HTPPopup from "../../Common/HTPPopup";
import HTPButton from "../../Common/HTPButton";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


class CreateModel extends Component {

    constructor(props) {
        super(props)
        let dropdown = ""
        this.state = { vendor:'', model_number:'', description:'', comment:'',calibration_frequency:'', groups:[],
            dropdown:"unprivileged", modal : false, displayMessage: [], requestStatus:'', resultingColor:'red'}
        this.handleChange = this.handleChange.bind(this)
        this.dropDownChanged = this.dropDownChanged.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    async handleSubmit(event){
        console.log("submit")
        console.log("priveledge:");
        console.log(this.state.dropdown);
        let token = 'Token ' + this.props.token
        const { username, name, email, password } = this.state
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept':'application/json'},
            body: JSON.stringify({username: username, name: name, email: email, password: password, groups: [this.state.dropdown], is_active: true})
        };

        const response = await fetch(AUTH_URLS.USERS, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => { //success
                let returnArray = []
                let responseTitle = ''
                let responseColor = ''
                if (json.includes('"id"')) {
                    returnArray =
                        [
                            'Success! The user was added:',
                            'Name : '+ this.state.name,
                            'Username : '+ this.state.username,
                            'Email : '+ this.state.email,
                        ]
                    responseTitle = 'Success! The user was added:'
                    responseColor = 'green'
                    this.props.updatePage(returnArray)
                }
                else {
                    returnArray = ErrorParser.parse(json)
                    responseTitle = 'Error while creating the User'
                    responseColor = 'red'
                }

                let newState = {}
                newState['displayMessage'] = returnArray
                newState['responseColor'] = responseColor
                newState['requestStatus'] = responseTitle
                this.setState(newState)
            })
            .catch((error) => { //failure
                let returnArray = error
                let responseTitle = 'Error while creating the User'
                let newState = {}
                newState['displayMessage'] = returnArray
                newState['requestStatus'] = responseTitle
                newState['responseColor'] = 'red'
                this.setState(newState)
            });
        this.toggleModal()
    }

    // Method causes to store all the values of the
    // input field in react state single method handle
    // input changes of all the input field using ES6
    // javascript feature computed property names
    handleChange=(name)=>(value)=>{
        let newState = {}
        newState[name] = value
        this.setState(newState)
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    getDisplayMessage = () => {
        let displayMessage = this.state.displayMessage
        return Array.isArray(displayMessage)  ? <div>
                    <ol>
                        {displayMessage.map(function(name, index){
                            return <ul key={ index }>{name}</ul>;
                        })}
                    </ol>
                </div> : <></>
    }

    dropDownChanged=(name)=>(value)=>{
        if (value.hasOwnProperty("value")) {
            let newState = {}
            newState["dropdown"] = value["value"]
            this.setState(newState)
        }
    }

    // Return a controlled form i.e. values of the
    // input field not stored in DOM values are exist
    // in react component itself as state
    render(){
        return(
            <div>
                <MDBContainer>
                    <br />
                    <MDBRow>
                        <MDBCol md="10">
                                <HTPInput label={'Name'} onChange={this.handleChange('name')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Username'} onChange={this.handleChange('username')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Email'} onChange={this.handleChange('email')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Password'} type = 'Password' onChange={this.handleChange('password')} placeholder={'required'} type="password"></HTPInput>
                            User Permissions
                            <Dropdown label={"User Permissions"} options={["unprivileged","instrument_management", "model_management", "calibration", "administrator"]} onChange={this.dropDownChanged("dropdown")} value={"unprivileged"} placeholder="Select an option" />
                            <HTPButton label={'Create User'} onSubmit={this.handleSubmit}></HTPButton>
                                <br/>
                                <text style={{ color: this.state.responseColor }}>{this.getDisplayMessage()}</text>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        )
    }

    doNothing() {
    }
}
//unprivileged, intrument_management, model_management, calibration, administrator

CreateModel.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired,
    updatePage : PropTypes.func.isRequired
}

export default CreateModel;
