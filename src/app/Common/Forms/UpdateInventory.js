import React from 'react'
import HTPButton from "../HTPButton";
import HTPPopup from "../HTPPopup";
import ModelFields, {MiscellaneousEnums} from "../../../utils/enums";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import {Instrument} from "../../../utils/ModelEnums";
import {handleFieldValueChange, handleFormChange, handleInputValueChange} from "../Inputs/input_utils";
import * as PropTypes from "prop-types";
import FormModal from "./FormModal";
import {FormEnums} from "./form_enums";
import ExportModel from "../../Pages/ImportExport/Widgets/ExportModel";

export default class UpdateInventory extends React.Component {

    static EDIT_MODE = "EDIT"
    static CREATE_MODE = "CREATE"

    constructor(props) {
        super(props);
        this.state = this.makeRefreshState()
    }

    makeRefreshState () {
        let {mode, subject, refreshFields, existingFields} = this.props
        let refreshedFields = refreshFields(mode, subject)
        if (existingFields) Object.assign(refreshedFields, existingFields)
        return {
            fields: refreshedFields,
            generalError: undefined,
            fieldErrors : {},
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
        return this.isInstrumentType() ? FormEnums.InstrumentFieldNames : FormEnums.EquipmentModelFieldNames
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

    validateRequiredFields(fields) {
        let fieldErrors = {}
        Object.keys(fields).forEach(fieldKey => {
            if (FormEnums.AllFieldRequirementTypes[fieldKey] === FormEnums.FieldRequirementTypes.REQUIRED && (!fields[fieldKey] || fields[fieldKey] == "")) {
                fieldErrors[fieldKey] = "Nice try! This is a required field"
            }
        })
        return fieldErrors
    }

    handleUpdate = () => {
        let {subject, updatePageState, token, mode, validateFields, editFunction, createFunction, retrieveFunction} = this.props
        let {fields} = this.state

        let fieldErrors = this.validateRequiredFields(fields)
        Object.assign(fieldErrors, validateFields(fields))
        if (Object.keys(fieldErrors).length > 0) {
            this.setState({fieldErrors : fieldErrors})
            return
        }

        let callBack = (response) => {
            this.toggleSuccessModal()
            retrieveFunction(token, response.pk,
                (json) => {
                    updatePageState({[this.getInventoryTypeName()]: json})
                    if (mode == UpdateInventory.CREATE_MODE) this.setState({createdSubject : json})
                }
            )
            if (this.state.fieldErrors) this.setState({fieldErrors : {}})
            if (this.state.generalError) this.setState({generalError : undefined})
            this.setEditModalShow(false)
        }

        let errorCallBack = (message) => {
            message = message.replace("model_number", "model number")
            this.setState({generalError : message})
        }

        let calibrationMode = fields[ModelFields.EquipmentModelFields.CALIBRATION_MODE]
        let calibratorCategories = fields[ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES]
        if (calibrationMode && calibrationMode == ModelFields.CalibrationModes.GUIDED_HARDWARE) {
            if (!calibratorCategories) calibratorCategories = []
            calibratorCategories.push(MiscellaneousEnums.KNOWN_CATEGORIES.KLUFE)
            fields[ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES] = calibratorCategories
        }
        if (calibrationMode && calibrationMode == ModelFields.CalibrationModes.LOAD_BANK) {
            if (!calibratorCategories) calibratorCategories = []
            calibratorCategories.push(MiscellaneousEnums.KNOWN_CATEGORIES.VOLTMETER)
            calibratorCategories.push(MiscellaneousEnums.KNOWN_CATEGORIES.SHUNT_METER)
            fields[ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES] = calibratorCategories
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
        let {editModalShow, successModalShow, all_model_categories, all_instrument_categories, vendors, modelNumbers,
            generalError, fieldErrors, createdSubject} = this.state
        let {token, subject, mode, history, existingFields} = this.props
        return(
            <div>
                <HTPButton variant="green"
                           color={"green"}
                           size={"sm"}
                           label={mode == UpdateInventory.EDIT_MODE ? 'Edit' : 'Create'}
                           onSubmit={() => this.setEditModalShow(true)}>
                </HTPButton>
                <FormModal
                    show={editModalShow}
                    onHide={() => this.setState(this.makeRefreshState(), () => this.setEditModalShow(false))}
                    token={token}
                    submitMethod={() => this.setState({fieldErrors : {}, generalError : undefined}, this.handleUpdate)}
                    subject={subject}
                    fields={this.getEditFields()}
                    title={mode == UpdateInventory.EDIT_MODE ? `Edit ${this.getInventoryTypeName(true)} ${subject[this.getIdentifier()]}` : `Create ${this.getInventoryTypeName(true)}`}
                    handleInputChange={this.handleFieldValueChange}
                    isEdit = {mode == UpdateInventory.EDIT_MODE}
                    modelCategories={all_model_categories}
                    instrumentCategories={all_instrument_categories}
                    vendors={vendors}
                    modelNumbers={modelNumbers}
                    generalError={generalError}
                    fieldErrors={fieldErrors}
                    fixedFields={existingFields}
                />
                <HTPPopup toggleModal={this.toggleSuccessModal}
                          message={`The ${this.getInventoryTypeName()} was ${mode == UpdateInventory.EDIT_MODE ? "edited" : "created"} successfully`}
                          title={"Success!"}
                          isOpen={successModalShow}
                          className={"text-success"}
                          additionalButtons={mode == UpdateInventory.CREATE_MODE && <HTPButton label={`Go to ${this.getInventoryTypeName(true)}`}
                                                                                                color={"green"}
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
    inventoryType : PropTypes.string.isRequired,
    existingFields : PropTypes.object
}

UpdateInventory.defaultProps = {
    existingFields : {}
}