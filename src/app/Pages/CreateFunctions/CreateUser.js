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
import { Multiselect } from 'multiselect-react-dropdown';
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";

export const LABELS =
    [
        'Unprivileged (Can view models, instruments, and categories)',
        'Instrument Management (All instrument functions excluding calibrations)',
        'Model Management (All models and instruments functions excluding calibrations)',
        'Calibration (All calibration functions)',
        "Administrator (All functions above including changing user functions",
    ]

export const SHORTEN_LABELS =
    {
        UNPRIVILEGED : 'unprivileged',
        INSTRUMENT_MANAGEMENT : 'instrument_management',
        MODEL_MANAGEMENT : 'model_management',
        CALIBRATION : 'calibration',
        ADMINISTRATOR : 'administrator',
    }

export const DISPLAYABLE_LABELS =
    {
        UNPRIVILEGED : 'Unprivileged',
        INSTRUMENT_MANAGEMENT : 'Instrument Management',
        MODEL_MANAGEMENT : 'Model Management',
        CALIBRATION : 'Calibration',
        ADMINISTRATOR : 'Administrator',
    }


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
            if (num==0){
                newArrayBackEndReadable.push(SHORTEN_LABELS.UNPRIVILEGED)
            }
            if (num==1){
                newArrayBackEndReadable.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
            }
            if (num==2){
                newArrayBackEndReadable.push(SHORTEN_LABELS.MODEL_MANAGEMENT)
            }
            if (num==3){
                newArrayBackEndReadable.push(SHORTEN_LABELS.CALIBRATION)
            }
            if (num==4){
                newArrayBackEndReadable.push(SHORTEN_LABELS.ADMINISTRATOR)
            }
        }
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS.ADMINISTRATOR)){
            newArrayBackEndReadable = []
            newArrayBackEndReadable.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
            newArrayBackEndReadable.push(SHORTEN_LABELS.MODEL_MANAGEMENT)
            newArrayBackEndReadable.push(SHORTEN_LABELS.CALIBRATION)
            newArrayBackEndReadable.push(SHORTEN_LABELS.ADMINISTRATOR)
        }
        if (newArrayBackEndReadable.length == 0) {
            newArrayBackEndReadable.push(SHORTEN_LABELS.UNPRIVILEGED)
        }
        if (newArrayBackEndReadable.length>1 && newArrayBackEndReadable.includes(SHORTEN_LABELS.UNPRIVILEGED)){
            newArrayBackEndReadable = newArrayBackEndReadable.filter(function(item) {
                return item !== SHORTEN_LABELS.UNPRIVILEGED
            })
        }
        if (newArrayBackEndReadable.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && !newArrayBackEndReadable.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)){
            newArrayBackEndReadable.push(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT)
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
                            {/*<Multiselect options={LABELS} onSelect={this.onSelect} onRemove={this.onRemove} showCheckbox={true} isObject={false} />*/}
                            <HTPAutoCompleteInput multiple = {true} options = {LABELS} label={'Categories'} size = {15} onChange={this.handleChange('dropdown')} placeholder={'Optional (defaults to upriviledged)'}/>
                            <p></p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                            <HTPButton label={'Create User'} onSubmit={this.handleSubmit}></HTPButton>
                            </div>
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

CreateUser.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired,
    updatePage : PropTypes.func.isRequired
}

export default CreateUser;