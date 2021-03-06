import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import NavBar from "../../../Common/HTPNavBar";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../../Common/Inputs/HTPInput";
import {AUTH_URLS, URLS} from "../../../../controller/strings";


class CreateModel extends Component {

    constructor(props) {
        super(props)
        this.state = { vendor:'', model_number:'', description:'', comment:'',calibration_frequency:''}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    async handleSubmit(event){
        let token = 'Token ' + this.props.token
        const { username, name, email, password } = this.state
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization':token, 'Accept':'application/json'},
            body: JSON.stringify({username: username, name: name, email: email, password: password, is_active: true})
        };

        const response = await fetch(AUTH_URLS.USERS, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => { //success
                if (json.includes('"id"')) {
                    event.preventDefault()
                    alert(` 
                  Successful added a new User:\n 
                  Username : ${username} 
                  Name : ${name} 
                  Email : ${email} 
                `)
                }
                else {
                    let results = ErrorParser.parse(json)
                    event.preventDefault()
                    alert(` 
                      Error while creating the User:\n 
                      ${results} 
                    `)
                }

                console.log(json)
            })
            .catch((error) => { //failure
                event.preventDefault()
                alert(` 
                  Error when creating the model:\n 
                  ${error} 
                  
                `)
                console.log("here")
                console.error('Error:', error);
            });
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

    // Return a controlled form i.e. values of the
    // input field not stored in DOM values are exist
    // in react component itself as state
    render(){
        return(
            <div>
                <NavBar user={this.props.user}/>
                <MDBContainer>
                    <br />
                    <MDBRow>
                        <MDBCol md="10">
                            <form onSubmit={this.handleSubmit}>
                                <HTPInput label={'Name'} onChange={this.handleChange('name')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Username'} onChange={this.handleChange('username')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Email'} onChange={this.handleChange('email')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Password'} type = 'Password' onChange={this.handleChange('password')} placeholder={'required'} type="password"></HTPInput>

                                <MDBBtn color="warning" outline type="button" onClick={this.handleSubmit}>
                                    Create User
                                    <MDBIcon far icon="paper-plane" className="ml-2" />
                                </MDBBtn>
                            </form>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        )
    }
}

CreateModel.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired
}

export default CreateModel;
