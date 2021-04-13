// import DragSortableList from 'react-drag-sortable'
// import React, {Component} from "react";
// import {Button, Card, Modal} from "react-bootstrap";
// import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
// import "./FormBuilder.css";
// import HTPButton from "../HTPButton";
// import CustomInput from "./CustomInput";
//
//
// class FormBuilder extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             inputList : [
//                 {content: (<CustomInput type="plaintext"/>)},
//                 {content: (<CustomInput type="header"/>)},
//                 {content: (<CustomInput type="input"/>)},
//                 {content: (<CustomInput type="plaintext" text="test4"/>)},
//             ],
//             // display: ''
//         }
//
//     }
//
//     addInput() {
//         let tempInputList = this.state.inputList
//         tempInputList.push({content: (<CustomInput type="plaintext"/>), id: 8})
//         this.setState({inputList:tempInputList})
//         this.render()
//     }
//
//     onSort = (sortedList,dropEvent) => {
//         // dropEvent
//         // console.log(sortedList)
//         // this.setState({inputList: sortedList})
//         // console.log(dropEvent)
//     }
//
//     remove(id) {
//         this.state.inputList.forEach(item =>
//             {
//                 if(item.id === id) {
//                     let tempInputList = this.state.inputList
//                     tempInputList.delete(id)
//                     this.setState({inputList: tempInputList})
//                 }
//             }
//         )
//     }
//
//     render() {
//
//         return (
//             <div className="createform">
//             <Modal
//                 {... this.props}
//                 size="lg"
//                 aria-labelledby="contained-modal-title-vcenter"
//                 centered
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title
//                         className={"text-info"}
//                         id="contained-modal-title-vcenter">
//                         {'Custom Form Generator'}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <MDBContainer>
//                         <MDBRow style={{justifyContent: 'center', alignItems: 'center'}}>
//                             <MDBCol md="7">
//                                 <div>
//                                     {/*<DragSortableList*/}
//                                     {/*    items={this.state.inputList}*/}
//                                     {/*    type="vertical"*/}
//                                     {/*    // onSort={this.onSort}*/}
//                                     {/*    placeholder={<div></div>}*/}
//                                     {/*    // onDrop={this.onSort}*/}
//                                     {/*/>*/}
//                                 </div>
//                                 <div>
//                                     <HTPButton
//                                         label={"Add input"}
//                                         onSubmit={() => {
//                                             this.addInput()
//                                         }}/>
//
//                                 </div>
//                             </MDBCol>
//                         </MDBRow>
//                     </MDBContainer>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <HTPButton
//                         label={"Save"}
//                         onSubmit={() => {
//                         }}/>
//                     <Button onClick={this.props.onHide}>Cancel</Button>
//                 </Modal.Footer>
//             </Modal>
//             </div>
//         );
//     }
// }
//
// export default FormBuilder;