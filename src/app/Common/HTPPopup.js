import React, {Component} from "react";
import {MDBBtn, MDBModal, MDBModalFooter, MDBModalHeader} from "mdbreact";
import {ModalBody} from "react-bootstrap";
import PropTypes from "prop-types";

export default class HTPPopup extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {isOpen, toggleModal, className, title, message, additionalButtons, additionalElements, closeLabel, closeFunction} = this.props
        return (<MDBModal isOpen={isOpen} toggle={toggleModal}>
                    <MDBModalHeader toggle={toggleModal} className={className}>
                        {title}
                    </MDBModalHeader>
                    <ModalBody>
                        {message}
                        {additionalElements}
                    </ModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="blue" onClick={closeFunction ? closeFunction : toggleModal}>{closeLabel}</MDBBtn>
                        {additionalButtons}
                    </MDBModalFooter>
                </MDBModal>)
    }
}

HTPPopup.propTypes = {
    isOpen : PropTypes.bool.isRequired,
    toggleModal : PropTypes.func.isRequired,
    className : PropTypes.string,
    title : PropTypes.string.isRequired,
    message : PropTypes.string.isRequired,
    additionalButtons : PropTypes.element,
    additionalElements : PropTypes.element,
    closeLabel : PropTypes.func,
    closeFunction : PropTypes.func
}

HTPPopup.defaultProps = {
    additionalButtons : <div/>,
    additionalElements : <div/>,
    className : "text-info",
    closeLabel : "Close"
}