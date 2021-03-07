import {Button} from "react-bootstrap";
import EditModal from "../../ModelDetailPage/EditModal";
import ModelFields from "../../../../utils/enums";
import React from "react";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import PropTypes from "prop-types";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {handleFormChange, handleInputChange, handleInputValueChange} from "../../../Common/Inputs/input_utils";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import {isNumeric} from "../../LoadBankPage/utils";

export default class UpdateInstrument extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.makeRefreshState()
    }

    makeRefreshState () {
        let {instrument} = this.props
        return {
            vendor: instrument.model.vendor,
            model_number: instrument.model.model_number,
            serial_number: instrument.serial_number,
            comment: instrument.comment,
            asset_tag_number: instrument.asset_tag_number,
            instrument_categories: instrument.instrument_categories,
            error: undefined
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
        MiscellaneousRequests.getVendors(this.props.token, this.state[ModelFields.EquipmentModelFields.MODEL_NUMBER], getVendorsCallBack, error => alert(error))
    }

    loadModelNumbers () {
        let getModelNumbersCallBack = (json) => {
                this.setState({modelNumbers: json})
        }
        MiscellaneousRequests.getModelNumbers(this.props.token, this.state[ModelFields.EquipmentModelFields.VENDOR], getModelNumbersCallBack, error => alert(error))
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
        let {instrument, updatePageState, token} = this.props
        let {model_number, vendor, serial_number, comment, asset_tag_number, instrument_categories} = this.state

        if (!isNumeric(asset_tag_number.toString()) || parseInt(asset_tag_number) > 999999 || parseInt(asset_tag_number) < 100000) {
            this.setState({error : "Asset tag must be a 6 digit number"})
            return
        } else if (comment && comment.length > 2000) {
            this.setState({error : "Comment cannot be greater than 2000 characters"})
            return;
        }

        let editCallback = (response) => {
            InstrumentRequests.retrieveInstrument(token, instrument.pk, (json) => {
                updatePageState({instrument: json})
            })
            if (this.state.error) this.setState({error : false})
            this.setEditModalShow(false)
        }
        let editError = (e) => {
            // alert("edit"+e)
            this.setState({error : e})
        }
        InstrumentRequests.editInstrument(token, instrument.pk, model_number, vendor,
            serial_number,comment,asset_tag_number, instrument_categories, editCallback,editError)
    }

    handleInputValueChange = (name) => (value) => {
        if (name == ModelFields.EquipmentModelFields.VENDOR) {
            handleInputValueChange(this, () => {
                this.loadVendors()
            })(name)(value)
        } else if (name == ModelFields.EquipmentModelFields.MODEL_NUMBER) {
            handleInputValueChange(this, () => {
                this.loadModelNumbers()
            })(name)(value)
        } else handleInputValueChange(this)(name)(value)
    }

    render() {
        let {editModalShow, all_model_categories, all_instrument_categories, vendors, modelNumbers, error} = this.state
        let {token, instrument} = this.props
        return(
            <div>
                <Button variant="green" onClick={() => this.setEditModalShow(true)}>
                    Edit
                </Button>
                <EditModal
                    show={editModalShow}
                    onHide={() => this.setState(this.makeRefreshState(), () => this.setEditModalShow(false))}
                    token={token}
                    submitMethod={this.handleEdit}
                    subject={instrument}
                    fields={ModelFields.InstrumentEditFields}
                    title={"Edit Instrument " + instrument[Instrument.FIELDS.ASSET_TAG]}
                    handleFormChange={handleFormChange(this)}
                    handleInputChange={this.handleInputValueChange}
                    isEdit = {true}
                    modelCategories={all_model_categories}
                    instrumentCategories={all_instrument_categories}
                    vendors={vendors}
                    modelNumbers={modelNumbers}
                    error={error}
                />
            </div>)}
}

UpdateInstrument.propTypes = {
    token : PropTypes.string.isRequired,
    instrument : PropTypes.object.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired
}