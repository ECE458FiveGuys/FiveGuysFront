import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";
import SubmitModal from "./ConfirmationModals/SubmitModal";
import CancelModal from "./ConfirmationModals/CancelModal";


class CustomFormView extends Component {
    constructor(props) {
        super(props);
        this.state = this.makeRefreshState()
    }


    makeRefreshState () {
        let fields = {}
        // let inputsExist=false
        if(this.props.fields){
            fields = JSON.parse(this.props.fields).form
            if (JSON.parse(this.props.fields).input){this.setState({inputsExist:true})}
        }
        return {
            fields: fields,
            cancelModalShow: false,
            submitModalShow: false,
            inputId: 0
        }
    }

    setCancelModalShow(boolean) {
        this.setState({cancelModalShow:boolean})
    }

    setSubmitModalShow(boolean) {
        this.setState({submitModalShow:boolean})
    }

    parseFields(field,id){
        // console.log("parsing fields",field,id)
        // this.setState({inputId:this.state.inputId+1})

        if(field.type === "header") {
            return(
                <h1 className="mb-3">
                  {field.value}
                </h1>
            )
        }
        else if(field.type === "input") {
            let {type,prompt} = JSON.parse(field.value)
            // this.setState({inputsExist:true})
            return(
                <div>
                    <HTPMultiLineInput size={1} label={prompt}
                                       placeholder={(this.props.preview)?("Input Preview"):("Enter "+type)}
                                       name={prompt} type = {'type'}
                                       onChange={(event) => this.onChange(type)(event)}
                                       readOnly={this.props.preview}
                                       id = {id}
                                       error={field.error}
                    />
                </div>
            )

        }
        else if(field.type === "text") {
            return (
                <ul>
                   <li>{field.value}</li>
                </ul>
            )
        }
    }

    renderFooter(inputExists){
        return (!inputExists || this.props.preview) ?
            (<Modal.Footer>
                {this.props.preview ? "":"This form has no inputs, unable to submit"}
                <Button onClick={() => this.props.onHide()} variant={"red"}>Close</Button>
            </Modal.Footer>)
            :
            (<Modal.Footer>
                <Button onClick={() => this.setCancelModalShow(true)} variant={"red"}>Close</Button>
                <Button onClick={() => this.setSubmitModalShow(true)}>Submit</Button>
            </Modal.Footer>)
    }

    errorOnChange(type,value) {
        // Return true if error exists in input
        // if(type === "full") return (value == "") ? "Need to enter input here":"";
        if(type === "text") return (value.length > 200) ? "Value longer than 200 characters":"";
        if(type === "number") return !(Number(value) == value) ? "Not a floating point integer":"";
    }

    onChange = (type) => (event) => {
        let fields = {...this.state.fields}

        let value = event.target.value
        let name = event.target.name
        let id = event.target.id

        fields[id].error = (this.errorOnChange(type,value))
        fields[id].key = name
        fields[id].inputValue = value

        this.setState({fields:fields})
    }

    cancelSubmission = () => {
        this.setState(this.makeRefreshState())
        this.props.onHide()
    }

    handleSubmit = () => {
        // let fields = [...this.state.fields]
        let fields = {...this.state.fields}
        let valid = true
        // console.log(fields)
        Object.keys(fields).map((id) => {
            if(fields[id].error && !fields[id].error === "" ) valid = false
            if(fields[id].type === "input" && !fields[id].inputValue) {
                valid = false
                fields[id].error = "Can't leave this empty"
            }
        })
        if(!valid) {
            this.setState({fields:fields})
            this.setSubmitModalShow(false)
        }else {
            let successCallBack = (response) => {
                console.log("Success")
                this.cancelSubmission()
            }
            let errorCallBack = (response) => {

            }


        }
    }

    render() {
        let {fields,inputsExist} = this.state
        if(this.props.fields){
            if (JSON.parse(this.props.fields).input){inputsExist = true}
        }
        return (

            <div>
                <Modal
                    {... this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title
                            className={"text-info"}
                            id="contained-modal-title-vcenter">
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MDBContainer>
                            <MDBRow style={{justifyContent: 'center', alignItems: 'center'}}>
                                <MDBCol md="10">
                                        {Object.keys(fields).map((id) => this.parseFields(fields[id],id))}
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </Modal.Body>
                    {
                        this.renderFooter(inputsExist)
                    }
                </Modal>
                <SubmitModal
                    show={this.state.submitModalShow}
                    onHide={() => this.setSubmitModalShow(false)}
                    onSubmission={this.handleSubmit}
                    message={'Are you sure you\'re ready to submit?'}
                    noInput={!inputsExist}
                />
                <CancelModal
                    show={this.state.cancelModalShow}
                    onHide={() => this.setCancelModalShow(false)}
                    onCancel={this.cancelSubmission}
                    message={'Are you sure you want to leave? Any changes you\'ve made will not be saved.'}
                />
            </div>
    );
    }

}

export default CustomFormView