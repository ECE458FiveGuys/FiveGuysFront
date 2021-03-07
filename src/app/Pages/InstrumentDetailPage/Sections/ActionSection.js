import {Button} from "react-bootstrap";
import EditModal from "../../ModelDetailPage/EditModal";
import ModelFields from "../../../../utils/enums";
import DeleteModal from "../../ModelDetailPage/DeleteModal";
import React from "react";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import PropTypes from "prop-types";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {handleFormChange, handleInputChange} from "../../../Common/Inputs/input_utils";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";

export default class ActionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vendor : props.instrument.model.vendor,
            model_number : props.instrument.model.model_number,
            serial_number : props.instrument.serial_number,
            comment : props.instrument.comment,
            asset_tag_number : props.instrument.asset_tag_number,
            instrument_categories : props.instrument.instrument_categories,
            error : undefined
        }
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    setEditModalShow(boolean) {
        this.setState({editModalShow:boolean})
    }

    async componentDidMount() {
        this.loadVendors()
        this.loadModelNumbers()
        this.loadCategories()
    }

    loadVendors () {
        let getVendorsCallBack = (json) => {
            this.setState({vendors: json})
        }
        MiscellaneousRequests.getVendors(this.props.token, this.state[ModelFields.EquipmentModelFields.VENDOR], getVendorsCallBack, error => alert(error))
    }

    loadModelNumbers () {
        let getModelNumbersCallBack = (json) => {
            this.setState({modelNumbers: json})
        }
        MiscellaneousRequests.getModelNumbers(this.props.token, this.state[ModelFields.EquipmentModelFields.MODEL_NUMBER], getModelNumbersCallBack, error => alert(error))
    }

    loadCategories () {
        let {token} = this.props
        let getCategoriesCallBack = (categoryType) => (json) => {
            let categories = json.map(category => {
                return category[ModelFields.CategoryFields.NAME]
            })
            this.setState({["all_" + categoryType] : categories})
        }
        MiscellaneousRequests.getCategories(token,
            Instrument.TYPE,
            getCategoriesCallBack)
    }

    handleEdit = () => {
        this.setEditModalShow(false)
        let {instrument, updatePageState, token} = this.props
        let {model_number, vendor, serial_number, comment, asset_tag_number, instrument_categories} = this.state
        let editCallback = (response) => {
            InstrumentRequests.retrieveInstrument(token, instrument.pk, (json) => {
                updatePageState({instrument: json})
            })
        }
        let editError = (e) => {
            alert("edit"+e)
        }
        InstrumentRequests.editInstrument(token, instrument.pk, model_number, vendor,
            serial_number,comment,asset_tag_number, instrument_categories, editCallback,editError)
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
        let {editModalShow, deleteModalShow, all_model_categories, all_instrument_categories, vendors, modelNumbers} = this.state
        let {token, instrument} = this.props
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
                    handleFormChange={handleFormChange(this)}
                    handleInputChange={handleInputChange(this)}
                    isEdit = {true}
                    modelCategories={all_model_categories}
                    instrumentCategories={all_instrument_categories}
                    vendors={vendors}
                    modelNumbers={modelNumbers}
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
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired
}