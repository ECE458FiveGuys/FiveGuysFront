import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";
import SubmitModal from "./ConfirmationModals/SubmitModal";
import CancelModal from "./ConfirmationModals/CancelModal";
import CalibrationRequests from "../../../controller/requests/calibration_requests";
import {getCurrentDate} from "../../utils";


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
        // console.log(fields)
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
            let {type,prompt,max,min} = JSON.parse(field.value)
            // console.log(max,min)
            // this.setState({inputsExist:true})
            return(
                <div>
                    <HTPMultiLineInput size={1} label={prompt}
                                       placeholder={(this.props.preview)?("Input Preview"):("Enter "+type)}
                                       name={prompt} type = {'type'}
                                       onChange={(event) => this.onChange(type)(max)(min)(event)}
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

    renderComment() {
        let {comment} = this.state
        return (
            <div>
                <HTPMultiLineInput size={1} label={"Comment"}
                                   placeholder={(this.props.preview)?("Input Preview"):("Enter comment")}
                                   name={prompt} type = {'type'}
                                   onChange={(event) => this.onChange("comment")(0)(0)(event)}
                                   readOnly={this.props.preview}
                                   // id = {id}
                                   error={(comment)?comment.error:undefined}
                />
            </div>
        )
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

    errorOnChange(type,value,max,min) {
        // Return true if error exists in input
        // if(type === "full") return (value == "") ? "Need to enter input here":"";
        if(type === "text") return (value.length > 200) ? "Value longer than 200 characters":"";
        if(type === "number") return (

            !(Number(value) == value) ? "Not a floating point integer":
                (Number(value) <= Number(max) && Number(value) >= Number(min)) ? "":"Value outside of range ["+min+","+max+"]"
        );
    }

    onChange = (type) => (max=0) => (min=0) =>(event) => {
        if(type === "comment") {
            let comment = {...this.state.comment}
            // let value = event.target.value

            comment.value = event.target.value
            this.setState({comment:comment})
            return
        }

        let fields = {...this.state.fields}

        let value = event.target.value
        let name = event.target.name
        let id = event.target.id
        // let max = (type === "input") ? ():0
        // if(type === comment)JSON.parse(fields[id].value)


        fields[id].error = (this.errorOnChange(type,value,max,min))

        // if(type === "number"){
        //
        // }

        fields[id].key = name
        fields[id].inputValue = value

        this.setState({fields:fields})
    }

    cancelSubmission = () => {
        this.setState(this.makeRefreshState())
        this.props.onHide()
    }

    handleSubmit = () => {
        let fields = {...this.state.fields}
        let valid = true
        let submitObj = {}
        // console.log(fields)
        // console.log(fields)
        Object.keys(fields).map((id) => {
            if(fields[id].error && !(fields[id].error === "") ) valid = false
            if(fields[id].type === "input" && !fields[id].inputValue) {
                valid = false
                fields[id].error = "Can't leave this empty"
            }
            if(fields[id].type === "input") {
                submitObj[fields[id].key] = fields[id].inputValue
            }
        })
        if(!this.state.comment || !this.state.comment.value) {
            valid = false
            let comment = {error:"Can't leave this empty"}
            this.setState({comment:comment})
        }
        if(!valid) {
            // console.log(fields)

            this.setState({fields:fields})
            this.setSubmitModalShow(false)
        }else {
            let comment = this.state.comment.value

            let submitString = JSON.stringify(submitObj)

            console.log(submitString)

            let successCallBack = (response) => {
                console.log("Success")
                this.cancelSubmission()
            }
            let errorCallBack = (response) => {
                alert(response)
            }

            CalibrationRequests.recordCalibration(this.props.token,this.props.instrument.pk,getCurrentDate(),
                this.props.user.id,comment,undefined,undefined,successCallBack,errorCallBack,
                undefined,undefined,submitString)

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
                                    {this.renderComment()}
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