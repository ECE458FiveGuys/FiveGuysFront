import React, { Component } from "react";
import PropTypes from "prop-types";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon} from 'mdbreact';
import {METHODS, URLS} from "../../../controller/strings";
import ModelFields from "../../../utils/enums";
import {User} from "../../../utils/dtos";
import ErrorParser from "./ErrorParser";
import HTPInput from "../../Common/Inputs/HTPInput";
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import {EquipmentModel, Instrument} from "../../../utils/ModelEnums";
import HTPPopup from "../../Common/HTPPopup";
import HTPButton from "../../Common/HTPButton";

class CreateModel extends Component {

    constructor(props) {
        super(props)
        this.state = {vendor:'', model_number:'', description:'', comment:'',
            calibration_frequency:'',categories_chosen:[], modal : false, displayMessage: [],
            requestStatus:'', responseColor:'red', calibration_mode : false}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async componentDidMount() {
        this.loadVendors()
        this.loadCategories()
    }

    loadCategories(){
        let token = 'Token ' + this.props.token
        let requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
        };

        const response = fetch(URLS.MODEL_CATEGORIES, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => {
                let results = ErrorParser.parseCategories(json)
                this.setState({'categories':results})
            })
            .catch((error) => {
                console.log("here")
                console.error('Error:', error);
            });
    }


    loadVendors() {
        let getVendorsCallBack = (json) => {
            this.setState({vendors: json})
        }
        MiscellaneousRequests.getVendors(this.props.token, '', getVendorsCallBack)
    }

    async handleSubmit(event){


        let token = 'Token ' + this.props.token
        const { vendor, model_number, description, comment, calibration_frequency, categories_chosen} = this.state
        let requestOptions = {}
        if (calibration_frequency=='') { //nothing inputed
            if (this.state.calibration_mode) {
                requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
                    body: JSON.stringify({
                        vendor: vendor,
                        model_number: model_number,
                        description: description,
                        comment: comment,
                        model_categories: categories_chosen,
                        calibration_mode: 'LOAD_BANK'
                    })
                }
            }
            else {
                requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
                    body: JSON.stringify({
                        vendor: vendor,
                        model_number: model_number,
                        description: description,
                        comment: comment,
                        model_categories: categories_chosen
                    })
                }
            }
        }
        else {
            if (this.state.calibration_mode) {
                requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
                    body: JSON.stringify({
                        vendor: vendor,
                        model_number: model_number,
                        description: description,
                        comment: comment,
                        calibration_frequency: calibration_frequency,
                        model_categories: categories_chosen,
                        calibration_mode: 'LOAD_BANK'
                    })
                }
            }
            else {
                requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': token, 'Accept': 'application/json'},
                    body: JSON.stringify({
                        vendor: vendor,
                        model_number: model_number,
                        description: description,
                        comment: comment,
                        calibration_frequency: calibration_frequency,
                        model_categories: categories_chosen,
                    })
                }
            }
        }

        const response = await fetch(URLS.MODELS, requestOptions)
            .then(response => {
                return response.text()})
            .then(json => {
                json.toString()
                let returnArray = []
                let responseTitle = ''
                let responseColor = ''
                if (json.includes('pk')) {
                    returnArray =
                        [
                            'Success! The model was added:',
                            'Vendor : '+ this.state.vendor,
                            'Model Number : '+ this.state.model_number,
                            'Description : '+ this.state.description,
                            'Comment : '+ this.state.comment,
                            'Calibration Frequency : '+ this.state.calibration_frequency,
                            'Categories : '+ this.state.categories_chosen
                        ]
                    responseTitle = 'Success! The model was added:'
                    responseColor = 'green'
                }
                else {
                    returnArray = ErrorParser.parse(json)
                    responseTitle = 'Error when creating the model:'
                    responseColor = 'red'
                }
                let newState = {}
                newState['displayMessage'] = returnArray
                newState['requestStatus'] = responseTitle
                newState['responseColor'] = responseColor
                this.setState(newState)
                console.log(json)
            })
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

    changeCheckedCalibrationMode = () => {
        this.setState({
            calibration_mode: !this.state.calibration_mode
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
        let text = 'Load Bank as calibration mode? '
        return(
            <div>
                <MDBContainer>
                    <MDBRow >
                        <MDBCol>
                            <HTPAutoCompleteInput options = {this.state.vendors} label={'Vendor'} size = {15} onChange={this.handleChange('vendor')} placeholder={'required'}/>

                            <HTPInput label={'Model Number'} onChange={this.handleChange('model_number')} placeholder={'required'}></HTPInput>

                            <HTPInput label={'Description'} onChange={this.handleChange('description')} placeholder={'required'}></HTPInput>

                            <HTPInput label={'Comment'} onChange={this.handleChange('comment')} placeholder={'optional'}></HTPInput>

                            <HTPInput label={'Calibration Frequency'} onChange={this.handleChange('calibration_frequency')} placeholder={'optional (integer)'}></HTPInput>

                            <HTPAutoCompleteInput multiple = {true} options = {this.state.categories} label={'Categories'} size = {15} onChange={this.handleChange('categories_chosen')} placeholder={'required'}/>

                            <label>
                                {text}
                                <input
                                    name="calibration_mode"
                                    type="checkbox"
                                    checked={this.state.calibration_mode}
                                    onChange={this.changeCheckedCalibrationMode} />
                            </label>
                            <br />
                            <HTPButton label={'Create Model'} onSubmit={this.handleSubmit}></HTPButton>
                            <br/>
                            <text style={{ color: this.state.responseColor }}>{this.getDisplayMessage()}</text>
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