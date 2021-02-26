import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import NavBar from "../../../Common/NavBar";


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
        const { vendor, model_number, comment} = this.state
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization':token, 'Accept':'application/json'},
            body: JSON.stringify({vendor: vendor, model_number: model_number})
        };

        const response = await fetch('http://group-six-test.colab.duke.edu/models/', requestOptions)
            .then(response => {
                return response.text()})
            .then(json => { //success
                            event.preventDefault()
                            alert(` 
                  Got the following model from database:\n 
                  Email : ${vendor} 
                  Name : ${model_number} 
                `)
                //const jsonJSON = JSON.parse(JSON.stringify(json));
                //console.log(jsonJSON)
                //console.log("here")
                //console.log(jsonJSON.parse('vendor'))

                //let name = json[0].pk;
                //name = JSON.parse(name);
                //name.data.forEach(value => {
                    //console.log(value.name, value.id);
                //});
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
    }

    // Return a controlled form i.e. values of the
    // input field not stored in DOM values are exist
    // in react component itself as state
    render(){
        return(
            <MDBContainer>
                <NavBar user={this.props.user}/>
                <h4 className="modal-title w-100 font-weight-bold">Create Instrument</h4>
                <br />
                <MDBRow>
                    <MDBCol md="10">
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                Vendor
                            </label>
                            <input
                                name='vendor'
                                placeholder='required'
                                value = {this.state.vendor}
                                onChange={this.handleChange}
                            />
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
                                Comment
                            </label>
                            <input
                                name='comment'
                                placeholder='optional'
                                value = {this.state.comment}
                                onChange={this.handleChange}
                            />

                            <br />
                            <br />

                            <MDBBtn color="warning" outline type="button" onClick={this.handleSubmit}>
                                Send
                                <MDBIcon far icon="paper-plane" className="ml-2" />
                            </MDBBtn>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

CreateModel.propTypes = {
    token: PropTypes.string.isRequired, // the token obtained through login
    user : PropTypes.instanceOf(User).isRequired
}

export default CreateModel;
