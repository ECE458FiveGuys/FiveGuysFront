import {Button} from "react-bootstrap";
import EditModal from "../../ModelDetailPage/EditModal";
import ModelFields from "../../../../utils/enums";
import React from "react";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import PropTypes from "prop-types";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {handleFormChange, handleInputValueChange} from "../../../Common/Inputs/input_utils";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import {isNumeric} from "../../LoadBankPage/utils";
import HTPPopup from "../../../Common/HTPPopup";
import HTPButton from "../../../Common/HTPButton";


export default class UpdateInstrument extends React.Component {

    static EDIT_MODE = "EDIT"
    static CREATE_MODE = "CREATE"

    constructor(props) {
        super(props);
        this.state = this.makeRefreshState()
    }

    makeRefreshState () {
        let {mode, instrument} = this.props
        return {
                vendor: mode == UpdateInstrument.EDIT_MODE ? instrument.model.vendor : undefined,
                model_number: mode == UpdateInstrument.EDIT_MODE ? instrument.model.model_number : undefined,
                serial_number: mode == UpdateInstrument.EDIT_MODE ? instrument.serial_number : undefined,
                comment: mode == UpdateInstrument.EDIT_MODE ? instrument.comment : undefined,
                asset_tag_number: mode == UpdateInstrument.EDIT_MODE ? instrument.asset_tag_number : undefined,
                instrument_categories: mode == UpdateInstrument.EDIT_MODE ? instrument.instrument_categories : undefined,
                error: undefined,
                createdInstrument: undefined
            }
    }

    toggleSuccessModal = () => {
        this.setState({successModalShow : !this.state.successModalShow},
            () => {if (!this.state.successModalShow) {
                this.setState(this.makeRefreshState())
            } })
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
        MiscellaneousRequests.getVendors(this.props.token, this.state[ModelFields.EquipmentModelFields.MODEL_NUMBER],
            getVendorsCallBack, error => alert(error))
    }

    loadModelNumbers () {
        let getModelNumbersCallBack = (json) => {
                this.setState({modelNumbers: json})
        }
        MiscellaneousRequests.getModelNumbers(this.props.token, this.state[ModelFields.EquipmentModelFields.VENDOR],
            getModelNumbersCallBack, error => alert(error))
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

    handleUpdate = () => {
        let {instrument, updatePageState, token, mode} = this.props
        let {model_number, vendor, serial_number, comment, asset_tag_number, instrument_categories} = this.state

        if (asset_tag_number && (!isNumeric(asset_tag_number.toString()) || parseInt(asset_tag_number) > 999999 || parseInt(asset_tag_number) < 100000)) {
            this.setState({error : "Asset tag must be a 6 digit number"})
            return
        } else if (comment && comment.length > 2000) {
            this.setState({error : "Comment cannot be greater than 2000 characters"})
            return;
        }

        let callBack = (response) => {
            this.toggleSuccessModal()
            InstrumentRequests.retrieveInstrument(token, response.pk, (json) => {
                mode == UpdateInstrument.EDIT_MODE ? updatePageState({instrument: json}) : this.setState({createdInstrument : json})
            })
            if (this.state.error) this.setState({error : false})
            this.setEditModalShow(false)
        }

        let errorCallBack = (e) => {
            this.setState({error : e})
        }

        if (mode == UpdateInstrument.EDIT_MODE) {
            InstrumentRequests.editInstrument(token, instrument.pk, model_number, vendor,
                serial_number, comment, asset_tag_number, instrument_categories, callBack, errorCallBack)
        } else if (mode == UpdateInstrument.CREATE_MODE) {
            InstrumentRequests.createInstrument(token, model_number, vendor,
                serial_number, comment, asset_tag_number, instrument_categories, callBack, errorCallBack)
        }
    }

    handleInputValueChange = (name) => (value) => {
        if (name == ModelFields.EquipmentModelFields.VENDOR) {
            handleInputValueChange(this, () => {
                this.loadModelNumbers()
            })(name)(value)
        } else if (name == ModelFields.EquipmentModelFields.MODEL_NUMBER) {
            handleInputValueChange(this, () => {
                this.loadVendors()
            })(name)(value)
        } else handleInputValueChange(this)(name)(value)
    }

    render() {
        let {editModalShow, successModalShow, all_model_categories, all_instrument_categories, vendors, modelNumbers, error, createdInstrument} = this.state
        let {token, instrument, mode, history} = this.props
        return(
            <div>
                <Button variant="green" onClick={() => this.setEditModalShow(true)}>
                    {mode == UpdateInstrument.EDIT_MODE ? 'Edit' : 'Create'}
                </Button>
                <EditModal
                    show={editModalShow}
                    onHide={() => this.setState(this.makeRefreshState(), () => this.setEditModalShow(false))}
                    token={token}
                    submitMethod={this.handleUpdate}
                    subject={instrument}
                    fields={ModelFields.InstrumentEditFields}
                    title={mode == UpdateInstrument.EDIT_MODE ? "Edit Instrument " + instrument[Instrument.FIELDS.ASSET_TAG] : "Create Instrument"}
                    handleFormChange={handleFormChange(this)}
                    handleInputChange={this.handleInputValueChange}
                    isEdit = {mode == UpdateInstrument.EDIT_MODE}
                    modelCategories={all_model_categories}
                    instrumentCategories={all_instrument_categories}
                    vendors={vendors}
                    modelNumbers={modelNumbers}
                    error={error}
                />
                <HTPPopup toggleModal={this.toggleSuccessModal}
                          message={`The instrument was ${mode == UpdateInstrument.EDIT_MODE ? "edited" : "created"} successfully`}
                          title={"Success!"}
                          isOpen={successModalShow}
                          className={"text-success"}
                          additionalButtons={mode == UpdateInstrument.CREATE_MODE && <HTPButton label={"Go to Instrument"}
                                                                                                color={"blue"}
                                                                                                onSubmit={() => {
                                                                                                    history.push(`/instruments/${createdInstrument.pk}`)
                                                                                                }}/>}
                />
            </div>)}
}

UpdateInstrument.propTypes = {
    token : PropTypes.string.isRequired,
    instrument : PropTypes.object.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    mode : PropTypes.string.isRequired
}