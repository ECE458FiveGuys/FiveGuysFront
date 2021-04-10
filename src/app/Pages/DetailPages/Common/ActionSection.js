import {Button} from "react-bootstrap";
import DeleteModal from "./Popups/DeleteModal";
import React from "react";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import PropTypes from "prop-types";
import Image from "../../../../assets/hpt_logo.png"
import ModelFields from "../../../../utils/enums";
import UpdateInventory from "../../../Common/Forms/UpdateInventory";
import UpdateInstrument from "../../../Common/Forms/UpdateInstrument";
import UpdateModel from "../../../Common/Forms/UpdateModel";
import HTPPopup from "../../../Common/HTPPopup";
import SortableComponent from "../../../Common/Forms/CustomFormGenerator";
import {MDBNavItem, MDBNavLink} from "mdbreact";
import CreateCustomFormButtons from "./CreateCustomFormButtons";

export default class ActionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    // setCustomFormModalShow(boolean) {
    //     this.setState({customFormModalShow:boolean})
    // }

    handleDelete = () => {
        let {subject, token, history, deleteFunction, type} = this.props
        this.setDeleteModalShow(false)
        if (type == ModelFields.ModelTypes.EQUIPMENT_MODEL && (subject["instruments"] && subject["instruments"].length > 0)) {
            this.setState({error : "Cannot delete this model, as instances already exist", modal : true})
            return
        }
        let deleteCallback = (model) => {
            history.push("/")
        }
        let deleteErrorCallBack = (e) => {
            alert(e)
        }
        deleteFunction(token, subject.pk, deleteCallback, deleteErrorCallBack);
    }

    toggleModal = () => {
        this.setState({modal : !this.state.modal}, () => {if (!this.state.modal) this.setState({error : false})})
    }

    render() {
        let {deleteModalShow, error, modal, customFormModalShow} = this.state
        let {token, subject, history, updatePageState, type, hasText, hasLogo} = this.props
        return(
            <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'flex-start', alignItems : 'center'}}>
                {hasText && <h1 style={{marginTop : 20, marginBottom : 20, textAlign : 'center'}}
                    className={"h5-responsive"}>
                    {`As an admin, you may:`}
                </h1>}
                <div style={{display : "flex", flexDirection : 'row'}}>
                    {type == ModelFields.ModelTypes.INSTRUMENT?
                        <UpdateInstrument
                            mode={UpdateInventory.EDIT_MODE}
                            token={token}
                            instrument={subject}
                            updatePageState={updatePageState}
                            history={history}/> :
                        <UpdateModel token={token}
                                     updatePageState={updatePageState}
                                     history={history}
                                     mode={UpdateInventory.EDIT_MODE}
                                     model={subject}/>}
                    <Button variant="red" onClick={() => this.setDeleteModalShow(true)}>
                        Delete
                    </Button>
                    <CreateCustomFormButtons
                        model={subject}
                    />
                </div>
                {hasLogo &&
                <img alt="loading"
                     style={{width: 250, marginTop: 50}}
                     src={Image}/>}
                <DeleteModal
                    show={deleteModalShow}
                    onHide={() => this.setDeleteModalShow(false)}
                    token = {token}
                    deleteMethod = {this.handleDelete}
                    message={"Are you sure you want to remove this from your inventory? This action cannot be undone."}
                />
                {/*<SortableComponent*/}
                {/*    show={customFormModalShow}*/}
                {/*    onHide={() => this.setCustomFormModalShow(false)}*/}
                {/*    token = {token}*/}
                {/*/>*/}
                <HTPPopup toggleModal={this.toggleModal}
                          message={error}
                          title={"Error!"}
                          className={"text-danger"}
                          isOpen={modal}/>
        </div>)}
}

ActionSection.propTypes = {
    token : PropTypes.string.isRequired,
    subject : PropTypes.object.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    deleteFunction : PropTypes.object.isRequired,
    type : PropTypes.string.isRequired,
    hasText : PropTypes.bool.isRequired,
    hasLogo : PropTypes.bool.isRequired
}

ActionSection.defaultProps = {
    hasText : true,
    hasLogo : true
}