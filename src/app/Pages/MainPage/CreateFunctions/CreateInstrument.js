import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchHeader from "../Widgets/SearchHeader";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import {METHODS, URLS} from "../../../../controller/strings";
import ModelFields from "../../../../utils/enums";
import {User} from "../../../../utils/dtos";
import NavBar from "../../../Common/HTPNavBar";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../../Common/Inputs/HTPInput";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";


class CreateModel extends Component {

    constructor(props) {
        super(props)
        this.state = { vendor:'', model_number:'', serial_number:'', comment:'', model_options:[],categories_chosen:[]}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async componentDidMount() {
        this.loadVendors()
        this.loadCategories()
    }

    loadVendors() {
        let getVendorsCallBack = (json) => {
            this.setState({vendors: json})
        }
        MiscellaneousRequests.getVendors(this.props.token, '', getVendorsCallBack)
    }

    loadCategories(){
        let token = 'Token ' + this.props.token
        let requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
        };

        const response = fetch(URLS.INSTRUMENT_CATEGORIES, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => {
                let results = ErrorParser.parseCategories(json)
                console.log(results)
                this.setState({'categories':results})
            })
            .catch((error) => {
                console.log("here")
                console.error('Error:', error);
            });
    }



    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    async handleSubmit(event){
        console.log(this.state.categories_chosen)

        let token = 'Token ' + this.props.token
        const { vendor, model_number, comment, serial_number, categories_chosen} = this.state
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization':token},
            //params: JSON.stringify({vendor: vendor, model_number: vendor})
        };
        let pk = ''
        const url = URLS.MODELS + '?' + 'vendor=' + vendor + '&model=' + model_number
        const response = await fetch(url, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => { //success
                json.toString()
                if (json.includes('pk')) {
                    const start = json.indexOf('pk')
                    let restOfJSON = json.substring(start+4)
                    let end = restOfJSON.indexOf('"')
                    pk = restOfJSON.substring(0, end-1)
                }
                else {
                    event.preventDefault()
                    alert(` 
                      Error while creating the instrument:\n 
                      Vendor and Model Number do not match a Model
                    `)
                }
                console.log(json)
            })
            .catch((error) => { //failure
                event.preventDefault()
                alert(` 
                  Error when creating the model:\n 
                  Vendor and Model Number do not match a model
                  
                `)
                console.error('Error:', error);
            });





        if (pk!='') {//successful got the pk
            //start of insertion

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization':token, 'Accept':'application/json'},
                body: JSON.stringify({model: pk, serial_number: serial_number, comment: comment, instrument_categories: categories_chosen})
            };

            const response = await fetch(URLS.INSTRUMENTS, requestOptions)
                .then(response => {
                    return response.text()})
                .then(json => {
                    json.toString()
                    if (json.includes('pk')) {
                        event.preventDefault()
                        alert(` 
                      Successful added a new Instrument:\n 
                      Model : ${pk} 
                      Serial Number : ${serial_number} 
                      Comment : ${comment} 
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
                    console.error('Error:', error);
                });

            //end of insertion
        }


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

                                <HTPAutoCompleteInput options = {this.state.vendors} label={'Vendor'} onChange={this.handleChange('vendor')} placeholder={'required'}/>
                                <HTPAutoCompleteInput options = {this.state.model_options} label={'Model Number'} onChange={this.handleChange('model_number')} placeholder={'required'}></HTPAutoCompleteInput>
                                <HTPInput label={'Serial Number'} onChange={this.handleChange('serial_number')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Comment'} onChange={this.handleChange('comment')} placeholder={'optional'}></HTPInput>
                                <HTPAutoCompleteInput multiple = {true} options = {this.state.categories} label={'Categories'} onChange={this.handleChange('categories_chosen')} placeholder={'required'}/>

                                <MDBBtn color="warning" outline type="button" onClick={this.handleSubmit}>
                                    Create Instrument
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
