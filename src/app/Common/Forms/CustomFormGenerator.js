import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import {Button, Modal, ModalBody} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBIcon, MDBModal, MDBModalHeader, MDBRow} from "mdbreact";
import React, {Component} from "react";
import CustomFormField from "./CustomFormField";
import './CreateCusotmForm.css';
import SubmitModal from "./ConfirmationModals/SubmitModal";
import CancelModal from "./ConfirmationModals/CancelModal";
import ModelRequests from "../../../controller/requests/model_requests";


const DragHandle = SortableHandle(() => <MDBIcon className={'drag-handle'} icon={'grip-lines'} size={'2x'}/>);

const SortableItem = SortableElement(({value,onRemove, onChange, onInputFieldChange}) => (
    <div className="SortableItem">
        {<CustomFormField type={value.type} id={value.id} dragHandle={<DragHandle/>} onRemove={() => onRemove(value.id)}
                          onChange={onChange} onInputFieldChange={onInputFieldChange}
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
        return {
            entries: {},
            items: [
                {id:0,type:'header'},
                {id:1,type:'input'},
            ],
            nextFieldId: 2,
            cancelModalShow: false,
            submitModalShow: false
        }
    }

    // scrollToBottom() {
    //     let el = document.getElementsByClassName('sortable-list')
    //     el.scrollTop = el.scrollHeight
    // }

    setCancelModalShow(boolean){
        // this.setState(this.makeRefreshState())
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
        let new_item = {id:nextFieldId, type:inputType};
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

        items.forEach((item) => {
            let entry = {}
            entry['type'] = item.type
            entry['value'] = entries[item.id]
            finalForm.push(entry)
        })
        let stringToSubmit = {'form':finalForm}
        let finalFormString = JSON.stringify(stringToSubmit)

        console.log(JSON.parse(finalFormString))
        let successCallback = (response) => {
            this.props.setExistingFields(finalFormString)
        }

        let errorCallback = (response) => {
            alert(response)
        }

        // ModelRequests.editModelWithFields(
        //     this.props.token,this.props.model,{custom_form:finalFormString},successCallback,errorCallback
        // )

        this.cancelSubmission()
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