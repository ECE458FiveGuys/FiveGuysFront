import React from 'react'
import HTPButton from "../HTPButton";
import HTPPopup from "../HTPPopup";
import ModelFields from "../../../utils/enums";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import {Instrument} from "../../../utils/ModelEnums";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import {handleFieldValueChange, handleFormChange, handleInputValueChange} from "../Inputs/input_utils";
import {Button} from "@material-ui/core";
import * as PropTypes from "prop-types";
import EditModal from "../../Pages/DetailPages/Common/Popups/EditModal";

export default class UpdateInventory extends React.Component {

    static EDIT_MODE = "EDIT"
    static CREATE_MODE = "CREATE"

    constructor(props) {
        super(props);
        this.state = this.makeRefreshState()
    }

    makeRefreshState () {
        let {mode, subject} = this.props
        return {
            fields: this.props.refreshFields(mode, subject),
            error: undefined,
            createdSubject: undefined
        }
    }

    isModelType = () => {
        return this.props.inventoryType == ModelFields.ModelTypes.EQUIPMENT_MODEL
    }

    isInstrumentType = () => {
        return this.props.inventoryType == ModelFields.ModelTypes.INSTRUMENT
    }

    getInventoryTypeName = (uppercase) => {
        if (uppercase) return this.isInstrumentType() ? "Instrument" : "Model"
        return this.isInstrumentType() ? "instrument" : "model"
    }

    getInventoryTypeUrl = () => {
        return this.isInstrumentType() ? "/instruments/" : "/models/"
    }

    getIdentifier = () => {
        return this.isInstrumentType() ? ModelFields.InstrumentFields.ASSET_TAG : ModelFields.EquipmentModelFields.MODEL_NUMBER
    }

    getEditFields = () => {
        return this.isInstrumentType() ? ModelFields.InstrumentEditFields : ModelFields.EquipmentModelEditFields
    }

    toggleSuccessModal = () => {
        this.setState({successModalShow : !this.state.successModalShow},
            () => {if (!this.state.successModalShow) {
                this.setState(this.makeRefreshState())
            } })
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
        MiscellaneousRequests.getVendors(this.props.token,
            this.isInstrumentType() ? this.state.fields[ModelFields.EquipmentModelFields.MODEL_NUMBER] : undefined,
            getVendorsCallBack, error => alert(error))
    }

    loadModelNumbers () {
        let getModelNumbersCallBack = (json) => {
            this.setState({modelNumbers: json})
        }
        MiscellaneousRequests.getModelNumbers(this.props.token, this.state.fields[ModelFields.EquipmentModelFields.VENDOR],
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
        let {subject, updatePageState, token, mode, validateFields, editFunction, createFunction, retrieveFunction} = this.props
        let {fields} = this.state
        try {
            validateFields(fields)
        } catch (e) {
            this.setState({error : e.message})
            return
        }

        let callBack = (response) => {
            this.toggleSuccessModal()
            retrieveFunction(token, response.pk, (json) => {
                mode == UpdateInventory.EDIT_MODE ? updatePageState({[this.getInventoryTypeName()]: json}) : this.setState({createdSubject : json})
            })
            if (this.state.error) this.setState({error : false})
            this.setEditModalShow(false)
        }

        let errorCallBack = (e) => {
            this.setState({error : e})
        }

        if (mode == UpdateInventory.EDIT_MODE) {
            editFunction(token, subject.pk, fields, callBack, errorCallBack)
        } else if (mode == UpdateInventory.CREATE_MODE) {
            createFunction(token, fields, callBack, errorCallBack)
        }
    }

    handleFieldValueChange = (name) => (value) => {
        if (name == ModelFields.EquipmentModelFields.VENDOR) {
            handleFieldValueChange(this, () => {
                this.loadModelNumbers()
            })(name)(value)
        } else if (name == ModelFields.EquipmentModelFields.MODEL_NUMBER) {
            handleFieldValueChange(this, this.isInstrumentType() ?
                () => this.loadVendors() : () => {})(name)(value)
        } else handleFieldValueChange(this)(name)(value)
    }

    render() {
        let {editModalShow, successModalShow, all_model_categories, all_instrument_categories, vendors, modelNumbers, error, createdSubject} = this.state
        let {token, subject, mode, history} = this.props
        return(
            <div>
                <HTPButton variant="green"
                           color={"green"}
                           label={mode == UpdateInventory.EDIT_MODE ? 'Edit' : 'Create'}
                           onSubmit={() => this.setEditModalShow(true)}>
                </HTPButton>
                <EditModal
                    show={editModalShow}
                    onHide={() => this.setState(this.makeRefreshState(), () => this.setEditModalShow(false))}
                    token={token}
                    submitMethod={this.handleUpdate}
                    subject={subject}
                    fields={this.getEditFields()}
                    title={mode == UpdateInventory.EDIT_MODE ? `Edit ${this.getInventoryTypeName(true)} ${subject[this.getIdentifier()]}` : `Create ${this.getInventoryTypeName(true)}`}
                    handleInputChange={this.handleFieldValueChange}
                    isEdit = {mode == UpdateInventory.EDIT_MODE}
                    modelCategories={all_model_categories}
                    instrumentCategories={all_instrument_categories}
                    vendors={vendors}
                    modelNumbers={modelNumbers}
                    error={error}
                />
                <HTPPopup toggleModal={this.toggleSuccessModal}
                          message={`The ${this.getInventoryTypeName()} was ${mode == UpdateInventory.EDIT_MODE ? "edited" : "created"} successfully`}
                          title={"Success!"}
                          isOpen={successModalShow}
                          className={"text-success"}
                          additionalButtons={mode == UpdateInventory.CREATE_MODE && <HTPButton label={`Go to ${this.getInventoryTypeName(true)}`}
                                                                                                color={"blue"}
                                                                                                onSubmit={() => {
                                                                                                    history.push(`${this.getInventoryTypeUrl()}${createdSubject.pk}`)
                                                                                                }}/>}
                />
            </div>)}
}

UpdateInventory.propTypes = {
    token : PropTypes.string.isRequired,
    subject : PropTypes.object.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    mode : PropTypes.string.isRequired,
    createFunction : PropTypes.func.isRequired,
    editFunction : PropTypes.func.isRequired,
    retrieveFunction : PropTypes.func.isRequired,
    refreshFields : PropTypes.func.isRequired,
    validateFields : PropTypes.func.isRequired,
    inventoryType : PropTypes.string.isRequired
}