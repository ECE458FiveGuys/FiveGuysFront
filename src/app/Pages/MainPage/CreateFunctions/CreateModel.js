import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import NavBar from "../../../Common/HTPNavBar";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../../Common/Inputs/HTPInput";


class CreateModel extends Component {

    constructor(props) {
        super(props)
        this.state = {vendor:'', model_number:'', description:'', comment:'',calibration_frequency:''}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(event){
        let token = 'Token ' + this.props.token
        const { vendor, model_number, description, comment, calibration_frequency } = this.state
        let requestOptions = {}
        if (calibration_frequency==''){ //nothing inputed
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization':token, 'Accept':'application/json'},
                body: JSON.stringify({vendor: vendor, model_number: model_number, description: description,
                    comment: comment, model_categories: []})
            };
        }
        else {
            requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
                body: JSON.stringify({
                    vendor: vendor, model_number: model_number, description: description,
                    comment: comment, calibration_frequency: calibration_frequency, model_categories: []
                })
            };
        }

        const response = await fetch('http://group-six-test.colab.duke.edu/models/', requestOptions)
            .then(response => {
                return response.text()})
            .then(json => {
                json.toString()
                if (json.includes('pk')) {
                    event.preventDefault()
                    alert(` 
                      Successful added a new Model:\n 
                      Vendor : ${vendor} 
                      Model Number : ${model_number} 
                      Description : ${description} 
                      Comment : ${comment} 
                      Calibration Frequency : ${calibration_frequency} 
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
    handleChange=(name)=>(value)=>{
        let newState = {}
        newState[name] = value
        this.setState(newState)

        //this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            //[event.target.name] : event.target.value

        //})
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
                            {/*<label htmlFor="defaultFormLoginEmailEx" className="grey-text">*/}
                            {/*    Vendor*/}
                            {/*</label>*/}
                            {/*<input*/}
                            {/*    type = 'text'*/}
                            {/*    classname = {'form-control'}*/}
                            {/*    name='vendor'*/}
                            {/*    placeholder='required'*/}
                            {/*    value = {this.state.vendor}*/}
                            {/*    onChange={this.handleChange}*/}
                            {/*/>*/}
                            <HTPInput label={'Vendor'} name = 'vendor' onChange={this.handleChange('vendor')} placeholder={'required'}></HTPInput>
                            <br />

                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Model Number
                            </label>
                            <input
                                name='model_number'
                                placeholder='required'
                                value = {this.state.model_number}
                                onChange={this.handleChange}
                            />
                            <br />


                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Description
                            </label>
                            <input
                                name='description'
                                placeholder='required'
                                value = {this.state.description}
                                onChange={this.handleChange}
                            />
                            <br />


                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Comment
                            </label>
                            <input
                                name='comment'
                                placeholder='optional'
                                value = {this.state.comment}
                                onChange={this.handleChange}
                            />
                            <br />


                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Calibration Frequency
                            </label>
                            <input
                                name='calibration_frequency'
                                placeholder='optional (integer)'
                                value = {this.state.calibration_frequency}
                                onChange={this.handleChange}
                            />
                            <br />
                            <br />

                            <MDBBtn color="warning" outline type="button" onClick={this.handleSubmit}>
                                Create Model
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
