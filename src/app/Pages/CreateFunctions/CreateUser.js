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
//import { Multiselect } from 'multiselect-react-dropdown';

export const LABELS =
    [
        'Unprivileged (Can view models, instruments, and categories)',
        'Instrument Management (Allows all Instruments functions excluding calibrations)',
        'Model Management (Allows all Models and Instruments functions excluding calibrations)',
        'Calibration (Allows the user to perform calibrations)',
        "Administrator (Allows all functions above including changing other user's abilities",
    ]

export const SHORTEN_LABELS =
    [
        'unprivileged',
        'instrument_management',
        'model_management',
        'calibration',
        'administrator',
    ]

export const DISPLAYABLE_LABELS =
    [
        'Unprivileged',
        'Instrument Management',
        'Model Management',
        'Calibration',
        'Administrator',
    ]


class CreateUser extends Component {

    constructor(props) {
        super(props)
        let dropdown = ""
        this.state = { vendor:'', model_number:'', description:'', comment:'',calibration_frequency:'', groups:[],
            dropdown:[], modal : false, displayMessage: [], requestStatus:'', resultingColor:'red'}
        this.handleChange = this.handleChange.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    async handleSubmit(event){
        await this.manageGroupsInput()
        console.log("submit")
        console.log("priveledge:");
        console.log(this.state.dropdown);
        let token = 'Token ' + this.props.token
        const { username, name, email, password, dropdown} = this.state
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token, 'Accept':'application/json'},
            body: JSON.stringify({username: username, name: name, email: email, password: password, groups: dropdown, is_active: true})
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

    manageGroupsInput = () =>{
        let newState = {}
        let newArrayBackEndReadable = [] //first turns the imput into readable backend
        for (let i=0; i<this.state.dropdown.length; i++){
            let num = LABELS.indexOf(this.state.dropdown[i])
            newArrayBackEndReadable.push(SHORTEN_LABELS[num])
        }  //then performs logic on the inputs
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS[4])){ //if admin, then keep only admin
            newArrayBackEndReadable = []
            newArrayBackEndReadable.push(SHORTEN_LABELS[4])
        }
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS[2]) && !newArrayBackEndReadable.includes(SHORTEN_LABELS[1])){ //if model, remove intrument
            newArrayBackEndReadable.push(SHORTEN_LABELS[1])
        }
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS[0]) && newArrayBackEndReadable.length>1){ //if unpriveledged with tohers, delete
            let index = newArrayBackEndReadable.indexOf(SHORTEN_LABELS[0])
            newArrayBackEndReadable.splice(index, 1);
        }
        newState["dropdown"] = newArrayBackEndReadable
        this.setState(newState)
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

    onSelect(selectedList, selectedItem) {
        let newState = {}
        newState["dropdown"] = selectedList
        this.setState(newState)
    }

    onRemove(selectedList, removedItem) {
        let newState = {}
        newState["dropdown"] = selectedList
        this.setState(newState)
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
                            {/*<Multiselect options={LABELS} onSelect={this.onSelect} onRemove={this.onRemove} showCheckbox={true} isObject={false} />*/}
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

CreateUser.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired,
    updatePage : PropTypes.func.isRequired
}

export default CreateUser;