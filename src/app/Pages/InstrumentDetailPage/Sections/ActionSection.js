import {Button} from "react-bootstrap";
import EditModal from "../../ModelDetailPage/EditModal";
import ModelFields from "../../../../utils/enums";
import DeleteModal from "../../ModelDetailPage/DeleteModal";
import React from "react";
import {Instrument} from "../../../../utils/ModelEnums";
import PropTypes from "prop-types";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";

export default class ActionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    setEditModalShow(boolean) {
        this.setState({editModalShow:boolean})
    }

    handleEdit = () => {
        this.setEditModalShow(false)
        let {instrument, updatePageState, token} = this.props
        let {serial_number, comment} = this.state
        let editCallback = (response) => {
            var temp_instrument = {...instrument}
            for (var field in ModelFields.InstrumentEditFields) {
                temp_instrument[ModelFields.InstrumentEditFields[field]] = this.state[ModelFields.InstrumentEditFields[field]]
            }
            updatePageState({instrument: temp_instrument})
        }
        let editError = (e) => {
            alert("edit"+e)
        }
        InstrumentRequests.editInstrument(token, instrument.pk, instrument.model['pk'],
            serial_number,comment,editCallback,editError)
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
        let {editModalShow, deleteModalShow} = this.state
        let {token, instrument, handleFormChange} = this.props
        return(
            <div style={{flex : .6, display : "flex", flexDirection : "column", justifyContent : 'center', alignItems : 'center'}}>
                <h1 style={{marginTop : 20}}
                    className={"h3-responsive"}>
                    Actions
                </h1>
                <h1 style={{marginTop : 20, marginBottom : 20, textAlign : 'center'}}
                    className={"h5-responsive"}>
                    {`As an admin, you may do the following:`}
                </h1>
                <div>
                    <Button variant="green" onClick={() => this.setEditModalShow(true)}>
                        Edit
                    </Button>
                    <Button variant="red" onClick={() => this.setDeleteModalShow(true)}>
                        Delete
                    </Button>
                </div>
                <EditModal
                    show={editModalShow}
                    onHide={() => this.setEditModalShow(false)}
                    token={token}
                    submitMethod={this.handleEdit}
                    subject={instrument}
                    fields={ModelFields.InstrumentEditFields}
                    title={"Edit Instrument " + instrument[Instrument.FIELDS.ASSET_TAG]}
                    handleFormChange={handleFormChange}
                    isEdit = {true}
                />
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
    handleFormChange : PropTypes.func.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired
}