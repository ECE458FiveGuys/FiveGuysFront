import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import {Button, Modal, ModalBody} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBIcon, MDBModal, MDBModalHeader, MDBRow} from "mdbreact";
import React, {Component} from "react";
import CustomFormField from "./CustomFormField";
import './CreateCusotmForm.css';
import SubmitModal from "./ConfirmationModals/SubmitModal";
import CancelModal from "./ConfirmationModals/CancelModal";
import ModelRequests from "../../../controller/requests/model_requests";
import {forEach} from "react-bootstrap/ElementChildren";


const DragHandle = SortableHandle(() => <MDBIcon className={'drag-handle'} icon={'grip-lines'} size={'2x'}/>);

const SortableItem = SortableElement(({value,onRemove, onChange, onInputFieldChange, onRangeInputFieldChange}) => (
    <div className="SortableItem">
        {<CustomFormField type={value.type} id={value.id} dragHandle={<DragHandle/>} onRemove={() => onRemove(value.id)}
                          onChange={onChange} onInputFieldChange={onInputFieldChange} onRangeInputFieldChange={onRangeInputFieldChange}
                          content={value.content} error={value.error}
                          rangeSection={value.range}
        />}
    </div>
));

const SortableList = SortableContainer(({items,onRemove,onChange,onInputFieldChange,onRangeInputFieldChange}) => {
    return(
        <ul className="SortableList">
            {items.map((value, index) => {
                return(
                <SortableItem
                      key={`item-${value.id}`}
                      index={index}
                      value={value}
                      // content={value.content}
                      onRemove={onRemove}
                      onChange={onChange}
                      onInputFieldChange={onInputFieldChange}
                      onRangeInputFieldChange={onRangeInputFieldChange}
                />
                )
            })}
        </ul>
    );
});

class SortableComponent extends Component {

    constructor(props) {
        super(props);
        this.state = this.makeRefreshState()
    }

    makeRefreshState () {
        let items = []
        let entries = {}
        let nextFieldId = 0

        if(this.props.existingFields) {
            let fields = JSON.parse(this.props.existingFields).form
            let range
            fields.forEach((field) => {
                    if(field.type === "input"){
                        let value = JSON.parse(field.value)
                        if(value.type === "number" && value.max){range = true}
                        else{range=false}
                    }
                    items.push({id: nextFieldId, type: field.type, content: field.value, range:range})
                    entries[nextFieldId] = field.value
                    nextFieldId++
                }
            )
        } else {
            items = [{id:0, type:'header', content:"{}", error: false},{id:1, type:'input', content:"{}", error:false}]
            nextFieldId = 2;
        }
        return {
            entries: entries,
            items: items,
            nextFieldId: nextFieldId,
            cancelModalShow: false,
            submitModalShow: false,

        }
    }

    declareErrors(errors) {
        errors.forEach((error)=>{
            let items = [...this.state.items]
            items.forEach((item)=>{
                if(item.id === error) {
                    item.error = true
                }
            })
            this.setState({items:items})
        })
    }

    removeError(errorId) {
        let items = [...this.state.items]
        items[errorId].error = false
        this.setState({items:items})
    }

    setCancelModalShow(boolean){
        this.setState({cancelModalShow:boolean})
    }

    setSubmitModalShow(boolean){
        this.setState({submitModalShow:boolean})
    }

    onInputFieldChange = (id) => (event) => {
        let newInputData = (this.state.entries[id]) ? JSON.parse(this.state.entries[id]):{}
        let items = [...this.state.items]
        if(event.target.type === 'select-one') {
            newInputData['type'] = event.target.value
            if(event.target.value === "number") {
                console.log("NUMBER")
                items.forEach((item) => {
                    if (item.id === id) {
                        item["max"] = ""
                        item["min"] = ""
                        item["range"] = true
                    }
                })
            } else {
                items.forEach((item) => {
                    if (item.id === id) {
                        item["range"] = false
                    }
                })
            }
            this.setState({items:items})
        }
        else if(event.target.type === 'textarea') {
            newInputData['prompt'] = event.target.value
        }
        else {
            console.log("Unprocessed change")
        }

        let newEntries = {...this.state.entries}
        newEntries[id] = JSON.stringify(newInputData)
        this.setState({entries:newEntries})
    }

    onChange = (id) => (event) => {
        let newEntries = Object.assign({},this.state.entries)
        newEntries[id] = event.target.value
        this.setState({entries:newEntries})
    }

    onRangeInputFieldChange = (id) => (event) => {
        let items = [...this.state.items]

        let name = event.target.name
        let value = event.target.value

        items.forEach((item)=>{
            if(item.id === id) {
                let content = JSON.parse(item.content)
                content[name] = value
                item.content = JSON.stringify(content)
            }
        })

        let newEntries = {...this.state.entries}

        let entry = JSON.parse(newEntries[id])
        entry[name] = value
        newEntries[id] = JSON.stringify(entry)
        this.setState({entries:newEntries})
    }


    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    remove = (id) => {
        let items = this.state.items;
        let entries = Object.assign({},this.state.entries);
        // let entries = {...this.state.entries}

        const newList = items.filter((item) => item.id !== id);
        delete entries[id]
        console.log(newList)
        this.setState({items: newList, entries:entries},()=>console.log(this.state.items))

    }

    add(inputType) {
        const {items,nextFieldId} = this.state;
        let content
        if(inputType === "input") {content = "{}"} else {content = ""}
        let new_item = {id:nextFieldId, type:inputType, content:content,error:false}; //TODO
        let newFieldId = nextFieldId + 1;
        items.push(new_item);

        this.setState({items : items, nextFieldId:newFieldId})
    }

    cancelSubmission = () => {
        this.setState(this.makeRefreshState())
        this.props.onHide()
    }

    submitForm = () => {
        let {items,entries} = this.state
        let finalForm = [];
        let errors = [];
        let inputExists = false
        items.forEach((item) => {
            let entry = {}

            if(item.type === "input") {inputExists = true}

            if(!entries || !entries[item.id] ||
                (item.type === "input"
                    && ( !JSON.parse(entries[item.id]).prompt
                        || !JSON.parse(entries[item.id]).type
                        || JSON.parse(entries[item.id]).prompt === ""
                        || (JSON.parse(entries[item.id]).type === "number" && (
                                !JSON.parse(entries[item.id]).max
                                || !JSON.parse(entries[item.id]).min
                                || JSON.parse(entries[item.id]).max === ""
                                || JSON.parse(entries[item.id]).min === ""
                                || Number(JSON.parse(entries[item.id]).max) <= Number(JSON.parse(entries[item.id]).min)
                            )
                        )
                    )
                )){
                // console.log(entries,item.id,JSON.parse(entries[item.id]).max <= JSON.parse(entries[item.id]).min)
                errors.push(item.id)
                // console.log("EMPTY FIELD"+item.id)
                // console.log(entries[item.id])
            } else {
                if(item.error) {
                    this.removeError(item.id)
                }
                // console.log(entries[item.id])
                entry['type'] = item.type
                entry['value'] = entries[item.id]
                // console.log(entry)
                finalForm.push(entry)
            }

        })
        if(errors.length > 0){
            this.declareErrors(errors)
            this.setSubmitModalShow(false)
        }
        else {
            let stringToSubmit = {'form': finalForm,'input':(inputExists)?"true":""}
            let finalFormString = JSON.stringify(stringToSubmit)

            let successCallback = (response) => {
                this.props.setExistingFields(finalFormString)
                this.cancelSubmission()
            }

            let errorCallback = (response) => {
                alert(response)
            }
            let {model} = this.props
            let fields = {
                vendor: model.vendor,
                model_number: model.model_number,
                description: model.description,
                calibration_frequency: model.calibration_frequency,
                custom_form: finalFormString
            }
            ModelRequests.editModelWithFields(
                this.props.token, model.pk, fields, successCallback, errorCallback
            )
        }
    }

    render() {
        const {items} = this.state;
        return (
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
                        Create Custom Form
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <MDBContainer className={'custom-form'}>
                            <MDBCol>
                                <MDBRow>
                                    <Button variant={"blue"} onClick={() => this.add("text")}>{"add text"}</Button>
                                    <Button variant={"blue"} onClick={() => this.add("header")}>{"add header"}</Button>
                                    <Button variant={"blue"} onClick={() => this.add("input")}>{"add input"}</Button>
                                </MDBRow>
                                <MDBRow>
                                    <div className={'overflow-auto sortable-list'}>
                                            <SortableList
                                                onSortEnd={this.onSortEnd}
                                                helperClass='sortable-helper'
                                                items={items}
                                                onRemove={this.remove}
                                                onChange={this.onChange}
                                                onInputFieldChange={this.onInputFieldChange}
                                                onRangeInputFieldChange={this.onRangeInputFieldChange}

                                            >
                                            </SortableList>
                                    </div>
                                </MDBRow>
                                <MDBRow className={'add-buttons'}>
                                    <Button variant={"green"} onClick={() => this.setSubmitModalShow(true)}>Save</Button>
                                    <Button variant={"danger"} onClick={() => this.setCancelModalShow(true)}>Cancel</Button>
                                </MDBRow>
                            </MDBCol>
                        <SubmitModal
                            show={this.state.submitModalShow}
                            onHide={() => this.setSubmitModalShow(false)}
                            onSubmission={this.submitForm}
                            message={'Are you sure you\'re ready to submit?'}
                            // hasInput={true}
                        />
                        <CancelModal
                            show={this.state.cancelModalShow}
                            onHide={() => this.setCancelModalShow(false)}
                            onCancel={this.cancelSubmission}
                            message={'Are you sure you want to leave? Any changes you\'ve made will not be saved.'}
                        />
                        </MDBContainer>
                </Modal.Body>
            </Modal>

        );
    }
}
export default SortableComponent