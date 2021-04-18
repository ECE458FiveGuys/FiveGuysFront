import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "./FormEntry";
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
        return {
            fields: fields,
            cancelModalShow: false,
            submitModalShow: false
        }
    }

    setCancelModalShow(boolean) {
        this.setState({cancelModalShow:boolean})
    }

    setSubmitModalShow(boolean) {
        this.setState({submitModalShow:boolean})
    }

    parseFields(field) {
        if(field.type === "header") {
            return(
                <h1 className="mb-3">
                  {field.value}
                </h1>
            )
        }
        else if(field.type === "input") {
            let {type,prompt} = JSON.parse(field.value)
            return(
                <div>
                    <HTPMultiLineInput size={1} label={prompt} placeholder={"Enter "+type} name={prompt} type = {'type'} onChange={(event) => this.onChange(type)(event)}/>
                    {/*{this.props.fieldErrors[fieldName] &&*/}
                    {/*<text style={{fontSize: 13}} className="text-danger">{this.props.fieldErrors[fieldName]}</text>}*/}
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

    errorOnChange(type,value) {
        // Return true if error exists in input
        if(type === "text") return (value.length > 200) ? "Value longer than 200 characters":"";
        if(type === "number") return !(Number(value) == value) ? "Not a floating point integer":"";
    }

    onChange = (type) => (event) => {
        let fields = (this.state.fields) ? this.state.fields : {}
        let value = event.target.value
        let name = event.target.name

        let error = (this.errorOnChange(type,value))

        fields[name] = {value: value, error:error}

        // this.setState(context.state, callBack)
        // console.log(name,value,error)
        // if(error) {
        //     console.log("hhhhh")
        // } else {
        //     console.log("ttttt")
        // }

        this.setState({fields:fields})

    }

    cancelSubmission = () => {
        this.setState(this.makeRefreshState())
        this.props.onHide()
    }

    handleSubmit = () => {
        console.log(this.state.fields)
    }

    render() {
        let parsedFields = []
        if(this.props.fields){
            parsedFields = JSON.parse(this.props.fields).form
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
                                        {parsedFields.map((field) =>
                                            this.parseFields(field)
                                        )}
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.setCancelModalShow(true)} variant={"red"}>Close</Button>
                        {(this.props.preview) ? <div/>:<Button onClick={() => this.setSubmitModalShow(true)}>Submit</Button>}
                    </Modal.Footer>
                </Modal>
                <SubmitModal
                    show={this.state.submitModalShow}
                    onHide={() => this.setSubmitModalShow(false)}
                    onSubmission={this.handleSubmit}
                    message={'Are you sure you\'re ready to submit?'}
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