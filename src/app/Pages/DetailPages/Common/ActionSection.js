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

export default class ActionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    handleDelete = () => {
        let {subject, token, history, deleteFunction} = this.props
        let deleteCallback = (model) => {
            history.push("/")
        }
        let deleteErrorCallBack = (e) => {
            alert("DELETE: "+e)
        }
        deleteFunction(token, subject.pk, deleteCallback, deleteErrorCallBack);
    }

    render() {
        let {deleteModalShow} = this.state
        let {token, subject, history, updatePageState, type, hasText, hasLogo} = this.props
        return(
            <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'flex-start', alignItems : 'center'}}>
                {hasText && <h1
                    className={"h3-responsive"}>
                    Actions
                </h1>}
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
        </div>)}
}

ActionSection.propTypes = {
    token : PropTypes.string.isRequired,
    subject : PropTypes.object.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    deleteFunction : PropTypes.object.isRequired,
    type : PropTypes.string.isRequired
}

ActionSection.defaultProps = {
    hasText : true,
    hasLogo : true
}