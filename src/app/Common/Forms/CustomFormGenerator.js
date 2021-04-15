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

const SortableItem = SortableElement(({value,onRemove, onChange, onInputFieldChange}) => (
    <div className="SortableItem">
        {<CustomFormField type={value.type} id={value.id} dragHandle={<DragHandle/>} onRemove={() => onRemove(value.id)}
                          onChange={onChange} onInputFieldChange={onInputFieldChange} content={value.content} error={value.error}
        />}
    </div>
));

const SortableList = SortableContainer(({items,onRemove,onChange,onInputFieldChange}) => {
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
            fields.forEach((field) => {
                    items.push({id: nextFieldId, type: field.type, content: field.value})
                    entries[nextFieldId] = field.value
                    nextFieldId++
                }
            )
        } else {
            items = [{id:0, type:'header', error: false},{id:1, type:'input', error:false}]
            nextFieldId = 2;
        }
        return {
            entries: entries,
            items: items,
            nextFieldId: nextFieldId,
            cancelModalShow: false,
            submitModalShow: false
        }
    }

    // scrollToBottom() {
    //     let el = document.getElementsByClassName('sortable-list')
    //     el.scrollTop = el.scrollHeight
    // }

    declareErrors(errors) {
        errors.forEach((error)=>{
            let items = [...this.state.items]
            items[error].error = true
            this.setState({items:items})
            console.log(error)
        })
    }

    removeError(errorId) {
        let items = [...this.state.items]
        items[errorId].error = false
        this.setState({items:items})
        // console.log(error)
    }

    setCancelModalShow(boolean){
        this.setState({cancelModalShow:boolean})
    }

    setSubmitModalShow(boolean){
        this.setState({submitModalShow:boolean})
    }

    onInputFieldChange = (id) => (event) => {
        let newInputData = (this.state.entries[id]) ? JSON.parse(this.state.entries[id]):{}
        if(event.target.type === 'select-one') {
            newInputData['type'] = event.target.value
        }
        else if(event.target.type === 'textarea') {
            newInputData['prompt'] = event.target.value
        }
        else {
            console.log("Unprocessed change")
        }

        let newEntries = Object.assign({},this.state.entries)
        newEntries[id] = JSON.stringify(newInputData)
        this.setState({entries:newEntries})
    }

    onChange = (id) => (event) => {
        let newEntries = Object.assign({},this.state.entries)
        newEntries[id] = event.target.value
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

        const newList = items.filter((item) => item.id !== id);
        delete entries[id]

        this.setState({items: newList, entries:entries})
    }

    add(inputType) {
        const {items,nextFieldId} = this.state;
        let new_item = {id:nextFieldId, type:inputType, error:false};
        let newFieldId = nextFieldId + 1;
        items.push(new_item);

        this.setState({items : items, nextFieldId:newFieldId})
        // this.scrollToBottom()
    }

    cancelSubmission = () => {
        this.setState(this.makeRefreshState())
        this.props.onHide()
    }

    submitForm = () => {
        let {items,entries} = this.state
        let finalForm = [];
        let errors = [];

        items.forEach((item) => {
            let entry = {}

            if(!entries || !entries[item.id] ||
                (item.type === "input"
                    && ( !JSON.parse(entries[item.id]).prompt
                        || !JSON.parse(entries[item.id]).type
                        || JSON.parse(entries[item.id]).prompt === "")
                )){
                errors.push(item.id)
                console.log("EMPTY FIELD"+item.id)
                // console.log(entries[item.id])
            } else {
                if(item.error) {
                    this.removeError(item.id)
                }
                console.log(entries[item.id])
                entry['type'] = item.type
                entry['value'] = entries[item.id]

                finalForm.push(entry)
            }

        })

        if(errors.length > 0){
            this.declareErrors(errors)
            this.setSubmitModalShow(false)
            console.log(errors)
        }
        else {
            console.log("submitting")

            let stringToSubmit = {'form': finalForm}
            let finalFormString = JSON.stringify(stringToSubmit)

            // console.log(JSON.parse(finalFormString))
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