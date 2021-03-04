import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import NavBar from "../../../Common/NavBar";
import ErrorParser from "./ErrorParser";


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

        const response = await fetch('http://group-six-test.colab.duke.edu/auth/users/', requestOptions)
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
                      Error while creating the model:\n 
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
    handleChange(event){
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name] : event.target.value
        })
        //<h4 className="modal-title w-100 font-weight-bold">Create User</h4>
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
                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                name
                            </label>
                            <input
                                name='name'
                                placeholder='required'
                                value = {this.state.name}
                                onChange={this.handleChange}
                            />
                            <br />

                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Username
                            </label>
                            <input
                                name='username'
                                placeholder='required'
                                value = {this.state.username}
                                onChange={this.handleChange}
                            />
                            <br />


                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Email
                            </label>
                            <input
                                name='email'
                                placeholder='required'
                                value = {this.state.email}
                                onChange={this.handleChange}
                            />
                            <br />


                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Password
                            </label>
                            <input
                                name='password'
                                placeholder='required'
                                input type="password"
                                value = {this.state.password}
                                onChange={this.handleChange}
                            />

                            <br />
                            <br />

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
