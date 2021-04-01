import React, {Component} from "react";
import DayPicker from "react-day-picker";
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";
import ModelFields from "../../../utils/enums";
import HTPAutoCompleteInput from "../Inputs/HTPAutoCompleteInput";
import {MDBBtn} from "mdbreact";
import {FormEnums} from "./form_enums";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import "react-day-picker/lib/style.css";
import HTPFileInput from "../Inputs/HTPFileInput";

class FormEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDay: new Date()
        }
    }

    handleDayClick = (day) => {
        this.props.handleDayClick(day)
        this.setState({selectedDay: day})
    }

    renderAlternateInputs(fieldName) {
        let {fixedFields, subject} = this.props

        if (fieldName === "date") {
            const today = new Date();
            return (
                <div style={{display : "flex", justifyContent : "center"}}>
                    <DayPicker
                            className={"react-datepicker__day"}
                            formatDate={'YYYY-MM-DD'}
                            disabledDays={{ after: today }}
                            selectedDays={this.state.selectedDay}
                            onDayClick={this.handleDayClick}
                        />
                </div>);

        }

        if (fieldName === ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED) {
            return (
                <div className="custom-control custom-checkbox" style={{display : 'flex', flexDirection : 'column'}}>
                    <input type="checkbox"
                           className="custom-control-input"
                           id="defaultUnchecked"
                           onChange={(event) => {
                               this.props.handleInputChange(fieldName)(event.target.checked)
                           }}
                           defaultChecked={this.props.isEdit && this.props.subject[ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED]}
                    />
                    <label className="custom-control-label" htmlFor="defaultUnchecked">
                        {FormEnums.EquipmentModelFieldNames[ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED]}
                    </label>
                </div>)
        }

        if (fieldName === ModelFields.EquipmentModelFields.CALIBRATION_MODE) {
            let defaultValue = undefined
            if (this.props.isEdit) {
                if (defaultValue != ModelFields.CalibrationModes.DEFAULT && defaultValue != ModelFields.CalibrationModes.NOT_CALIBRATABLE) {
                    defaultValue = this.props.subject[fieldName]
                }
            }
            return (
                <div>
                    <label  style={{marginBottom : 10}}
                            htmlFor={"calibration_mode_selector"}>
                        Advanced Calibration Modes
                    </label>
                    <select
                        defaultValue={defaultValue}
                        onChange={(event) => {
                                           this.props.handleInputChange(fieldName)(event.target.value)
                                       }}
                        id = "calibration_mode_selector"
                        className="browser-default custom-select">
                        <option value={ModelFields.CalibrationModes.DEFAULT}>None (simple calibration only, if calibratable)</option>
                        <option value={ModelFields.CalibrationModes.LOAD_BANK}>Load Bank</option>
                        <option value={ModelFields.CalibrationModes.GUIDED_HARDWARE}>Guided Hardware (Klufe 5700)</option>
                    </select>
                    {this.props.fieldErrors[fieldName] && <text style={{fontSize : 13}} className="text-danger">{this.props.fieldErrors[fieldName]}</text>}
                </div>
            )
        }

        if (fieldName === ModelFields.InstrumentFields.COMMENT) {
            return (
                <HTPMultiLineInput onChange={(area) => this.props.handleInputChange(ModelFields.CalibrationFields.Comment)(area.target.value)}
                                   label={"Any comments?"}
                                   error={this.props.fieldErrors[fieldName]}
                                   name={ModelFields.CalibrationFormFields.Comment}
                                   defaultValue={(this.props.isEdit) ? this.props.subject[fieldName] : ""}
                                   placeholder={FormEnums.AllFieldPlaceHolders[fieldName]}/>
            )
        }

        if (fieldName === ModelFields.CalibrationFields.AdditionalFile){
            return (
                <div>
                    Choose some additional evidence!
                    <HTPFileInput handleFileSelect={this.props.handleFileSelect} id={"additionalEvidence"}/>
                </div>
            );
        }

        if (fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ||
            fieldName === ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES ||
            fieldName === ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES ||
            fieldName === ModelFields.CalibrationFields.CalibratedWith) {
            let {modelCategories, instrumentCategories, handleInputChange, calibratedWithOptions} = this.props
            return (<HTPAutoCompleteInput placeholder={FormEnums.AllFieldPlaceHolders[fieldName]}
                                          options={fieldName === ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES ? instrumentCategories :
                                              fieldName == ModelFields.CalibrationFields.CalibratedWith ? calibratedWithOptions : modelCategories}
                                          onChange={handleInputChange(fieldName)}
                                          label={fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ? "Model Categories" :
                                              fieldName === ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES ? "Instrument Categories" :
                                                  fieldName == ModelFields.CalibrationFields.CalibratedWith ? "Calibrated With" :
                                                  "Calibrator Categories"}
                                          disabled={fixedFields[fieldName]}
                                          multiple={true}
                                          error={this.props.fieldErrors[fieldName]}
                                            defaultValue={subject ? subject[fieldName] : fixedFields[fieldName] ? fixedFields[fieldName] : ''}
                                            size={13}/>
            )
        }

        if (fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER || fieldName === ModelFields.EquipmentModelFields.VENDOR){
            let {vendors, modelNumbers, handleInputChange} = this.props
            let defaultValue = ""
            if (this.props.isEdit) {
                if (subject.model) {
                    defaultValue = subject.model[fieldName]
                } else {
                    defaultValue = subject[fieldName]
                }
            }
            if (fixedFields[fieldName]) {
                defaultValue = fixedFields[fieldName]
            }
            return(
                <div className="form-outline">
                    <HTPAutoCompleteInput placeholder={FormEnums.AllFieldPlaceHolders[fieldName]}
                                          options={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? modelNumbers : vendors}
                                          onChange={handleInputChange(fieldName)}
                                          label={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? "Model Number" : "Vendor"}
                                          multiple={false}
                                          disabled={fixedFields[fieldName]}
                                          error={this.props.fieldErrors[fieldName]}
                                          defaultValue={defaultValue}
                                          size={13}/>
                </div>
            );
        }
    }

    render() {
        let AlternateInputs = [
            ModelFields.CalibrationFields.Date,
            ModelFields.CalibrationFields.AdditionalFile,
            ModelFields.EquipmentModelFields.MODEL_NUMBER,
            ModelFields.EquipmentModelFields.VENDOR,
            ModelFields.InstrumentFields.COMMENT,
            ModelFields.EquipmentModelFields.MODEL_CATEGORIES,
            ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES,
            ModelFields.EquipmentModelFields.CALIBRATION_MODE,
            ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED,
            ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES,
            ModelFields.CalibrationFields.CalibratedWith
        ]

        let {formFields, generalError, fieldErrors, fixedFields, subject} = this.props
        return(
            <form onKeyDown={(e) => {if (e.key === 'Enter') e.preventDefault()}}
                  onSubmit={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                          }
                      }>
                {Object.keys(formFields).map((fieldKey, index) =>
                    AlternateInputs.includes(fieldKey) ?
                        <div style={{marginTop : 10}}>
                            {this.renderAlternateInputs(fieldKey)}
                        </div>
                        : <div className="form-outline" style={{marginTop : 10}}>
                                <label htmlFor="validationServer01" className="dark-grey-text form-label">{formFields[fieldKey]}</label>
                                <input
                                    type="text"
                                    className={fieldErrors[fieldKey] ? "form-control is-invalid" : "form-control"}
                                    id="validationServer01"
                                    placeholder={FormEnums.AllFieldPlaceHolders[fieldKey]}
                                    disabled={fixedFields[fieldKey]}
                                    onChange={(e) => this.props.handleInputChange(fieldKey)(e.target.value)}
                                    defaultValue={subject ? subject[fieldKey] : fixedFields[fieldKey] ? fixedFields[fieldKey] : ''}
                                />
                                {fieldErrors[fieldKey] &&
                                    <div style={{fontSize : 13}} className="text-danger">
                                        {fieldErrors[fieldKey]}
                                    </div>
                                }
                            </div>)}
                {generalError &&
                    <div style={{marginTop : 10, display : 'flex', justifyContent : 'center', alignItems : "center", textAlign: 'center'}}>
                        <text className={'text-danger'}>
                            {generalError}
                        </text>
                    </div>}
                <div className="text-center mt-4">
                    <MDBBtn color="dark-green"
                            onsubmit="return false"
                            type={"submit"}
                            action={false}
                            onClick={event => this.props.submitMethod()}>
                        Submit
                    </MDBBtn>
                </div>
            </form>
        );}
}
export default FormEntry


FormEntry.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    formFields : PropTypes.object.isRequired,
    submitMethod : PropTypes.func.isRequired,
    handleInputChange : PropTypes.func.isRequired,

    generalError : PropTypes.string,
    fieldErrors : PropTypes.object,
    fixedFields : PropTypes.object,
    subject : PropTypes.object,
    handleDayClick : PropTypes.func,
    handleFileSelect : PropTypes.func,
    modelCategories : PropTypes.array,
    instrumentCategories : PropTypes.array,
    calibratedWithOptions : PropTypes.array,
    vendors : PropTypes.array,
    modelNumbers : PropTypes.array,
}

FormEntry.defaultProps = {
    fixedFields : {},
    fieldErrors : {}
}