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
import HTPPopup from "../../../Common/HTPPopup";
import HTPButton from "../../../Common/HTPButton";


class CreateModel extends Component {

    constructor(props) {
        super(props)
        this.state = { vendor:'', model_number:'', serial_number:'', comment:'', model_options:[],categories_chosen:[],
            modal : false, displayMessage: [], requestStatus:'', responseColor:'red'}
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
                this.setState({'categories':results})
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }



    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    async handleSubmit(event){

        let token = 'Token ' + this.props.token
        const { vendor, model_number, comment, serial_number, categories_chosen} = this.state
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization':token},
            //params: JSON.stringify({vendor: vendor, model_number: vendor})
        };
        let pk = ''
        const url = URLS.MODELS + '?' + 'vendor=' + vendor + '&model_number=' + model_number
        const response = await fetch(url, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => { //success
                json.toString()
                console.log(json)
                let returnArray = []
                let responseTitle = ''
                let responseColor = ''
                if (json.includes('"count":1')) {
                    const start = json.indexOf('pk')
                    let restOfJSON = json.substring(start+4)
                    let end = restOfJSON.indexOf('"')
                    pk = restOfJSON.substring(0, end-1)
                }
                else {
                    returnArray =
                        [
                            'Vendor and Model Number do not match a model'
                        ]
                    responseColor = 'red'
                    responseTitle = 'Failure!'
                    let newState = {}
                    newState['displayMessage'] = returnArray
                    newState['responseColor'] = responseColor
                    newState['requestStatus'] = responseTitle
                    this.setState(newState)
                }
            })
            .catch((error) => { //failure
                let returnArray = []
                let responseTitle = ''
                returnArray =
                    ['Vendor and Model Number do not match a model']
                responseTitle = 'Failure!'
                let newState = {}
                newState['displayMessage'] = returnArray
                newState['responseColor'] = 'red'
                newState['requestStatus'] = responseTitle
                this.setState(newState)
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
                        let returnArray = []
                        let responseColor = ''
                        let responseTitle = ''
                        returnArray =
                            [
                                'Vendor : '+ this.state.vendor,
                                'Model Number : '+ this.state.model_number,
                                'Serial Number : '+ this.state.serial_number,
                                'Comment : '+ this.state.comment,
                                'Categories : '+ this.state.categories_chosen
                            ]
                        let newState = {}
                        responseColor = 'green'
                        responseTitle = 'Success! The Instrument was added:'
                        newState['displayMessage'] = returnArray
                        newState['responseColor'] = responseColor
                        newState['requestStatus'] = responseTitle
                        this.setState(newState)
                    }
                    else {
                        console.log(json)
                        let results = ErrorParser.parse(json)
                        let returnArray = []
                        let responseTitle = 'Failure!'
                        let responseColor = 'red'
                        let newState = {}
                        newState['displayMessage'] = results
                        newState['responseColor'] = responseColor
                        newState['requestStatus'] = responseTitle
                        this.setState(newState)
                    }
                })
                .catch((error) => { //failure
                    let responseTitle = ''
                    responseTitle = 'Failure!'
                    let newState = {}
                    newState['displayMessage'] = error
                    newState['responseColor'] = 'red'
                    newState['requestStatus'] = responseTitle
                    this.setState(newState)
                    console.error('Error:', error);
                });
            //end of insertion
        }
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
        return (<div>
            <ol>
                {displayMessage.map(function(name, index){
                    return <ul key={ index }>{name}</ul>;
                })}
            </ol>
        </div>)
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
                                <HTPAutoCompleteInput options = {this.state.vendors} label={'Vendor'} onChange={this.handleChange('vendor')} placeholder={'required'}/>
                                <HTPAutoCompleteInput options = {this.state.model_options} label={'Model Number'} onChange={this.handleChange('model_number')} placeholder={'required'}></HTPAutoCompleteInput>
                                <HTPInput label={'Serial Number'} onChange={this.handleChange('serial_number')} placeholder={'required'}></HTPInput>
                                <HTPInput label={'Comment'} onChange={this.handleChange('comment')} placeholder={'optional'}></HTPInput>
                                <HTPAutoCompleteInput multiple = {true} options = {this.state.categories} label={'Categories'} onChange={this.handleChange('categories_chosen')} placeholder={'required'}/>

                            <HTPButton label={'Create Instrument'} onSubmit={this.handleSubmit}></HTPButton>
                            <br/>
                            <text style={{ color: this.state.responseColor}}>{this.getDisplayMessage()}</text>
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
