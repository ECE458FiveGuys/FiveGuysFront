import {Button} from "react-bootstrap";
import DeleteModal from "../../ModelDetailPage/DeleteModal";
import React from "react";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import PropTypes from "prop-types";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import UpdateInstrument from "./UpdateInstrument";

export default class ActionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    handleDelete = () => {
        let {instrument, token, history} = this.props
        let deleteInstrumentCallback = (model) => {
            history.push("/")
        }
        let deleteInstrumentError = (e) => {
            alert("DELETE: "+e)
        }
        InstrumentRequests.deleteInstruments(token, instrument.pk, deleteInstrumentCallback,deleteInstrumentError);
    }

    render() {
        let {deleteModalShow} = this.state
        let {token, instrument, history, updatePageState} = this.props
        return(
            <div style={{flex : .45, display : "flex", flexDirection : "column", justifyContent : 'center', alignItems : 'center'}}>
                <h1 style={{marginTop : 20}}
                    className={"h3-responsive"}>
                    Actions
                </h1>
                <h1 style={{marginTop : 20, marginBottom : 20, textAlign : 'center'}}
                    className={"h5-responsive"}>
                    {`As an admin, you may:`}
                </h1>
                <div style={{display : "flex", flexDirection : 'row'}}>
                    <UpdateInstrument
                        mode={UpdateInstrument.EDIT_MODE}
                        token={token}
                        instrument={instrument}
                        updatePageState={updatePageState}
                        history={history}/>
                    <Button variant="red" onClick={() => this.setDeleteModalShow(true)}>
                        Delete
                    </Button>
                </div>
                <DeleteModal
                    show={deleteModalShow}
                    onHide={() => this.setDeleteModalShow(false)}
                    token = {token}
                    deleteMethod = {this.handleDelete}
                    message={"Are you sure you wat to remove instrument " + instrument[Instrument.FIELDS.ASSET_TAG] + "?"}
                />
        </div>)}
}

ActionSection.propTypes = {
    token : PropTypes.string.isRequired,
    instrument : PropTypes.object.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired
}