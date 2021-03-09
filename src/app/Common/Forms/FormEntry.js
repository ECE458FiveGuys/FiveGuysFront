import React, {Component, useState} from "react";
import DayPicker from "react-day-picker";
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";
import ModelFields from "../../../utils/enums";
import HTPAutoCompleteInput from "../Inputs/HTPAutoCompleteInput";
import FileUtils from "../../../utils/file_utils";
import Checkbox from "../Tables/TableWidgets/Checkbox";
import {MDBBtn} from "mdbreact";
import {FormEnums} from "./form_enums";

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
        if (fieldName === "date") {
            const today = new Date();
            return (
                <div style={{display : "flex", justifyContent : "center"}}>
                    <DayPicker
                            formatDate={'YYYY-MM-DD'}
                            disabledDays={{ after: today }}
                            selectedDays={this.state.selectedDay}
                            onDayClick={this.handleDayClick}
                        />
                </div>);

        }

        if (fieldName === ModelFields.EquipmentModelFields.CALIBRATION_MODE) {
            return (
                <div className="custom-control custom-checkbox" style={{display : 'flex', flexDirection : 'column'}}>
                    <input type="checkbox"
                           className="custom-control-input"
                           id="defaultUnchecked"
                           onChange={(event) => {
                               this.props.handleInputChange(fieldName)(event.target.checked ?
                                   ModelFields.CalibrationModes.LOAD_BANK : ModelFields.CalibrationModes.DEFAULT)
                           }}
                           defaultChecked={this.props.isEdit && this.props.subject[ModelFields.EquipmentModelFields.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK}
                    />
                        <label className="custom-control-label" htmlFor="defaultUnchecked">
                            Load Bank Supported?
                        </label>
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
                    <div className="input-group" style={{marginTop : 10}}>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="additionalEvidence"
                                aria-describedby="additionalEvidenceAddon01"
                                onChange={event => {
                                    this.props.handleFileSelect(event)
                                    let filename = FileUtils.getFileNameFromPath(event.target.value)
                                    this.setState({fileSelected : filename})
                                }}
                            />
                            <label className="custom-file-label" htmlFor="additionalEvidence">
                                {this.state.fileSelected ? this.state.fileSelected : "Choose file"}
                            </label>
                        </div>
                    </div>
                </div>
            );
        }

        if (fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES || fieldName === ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES) {
            let {modelCategories, instrumentCategories, handleInputChange} = this.props
            return (
                <HTPAutoCompleteInput placeholder={FormEnums.AllFieldPlaceHolders[fieldName]}
                                      options={fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ? modelCategories : instrumentCategories}
                                      onChange={handleInputChange(fieldName)}
                                      label={fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ? "Model Categories" : "Instrument Categories"}
                                      multiple={true}
                                      error={this.props.fieldErrors[fieldName]}
                                        defaultValue={ this.props.subject ? ((this.props.isEdit) ?
                                                                      this.props.subject[fieldName] : "") : ""}
                                        size={13}/>
            )
        }

        if (fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER || fieldName === ModelFields.EquipmentModelFields.VENDOR){
            let {vendors, modelNumbers, handleInputChange} = this.props
            return(
                <div className="form-outline">
                <HTPAutoCompleteInput placeholder={FormEnums.AllFieldPlaceHolders[fieldName]}
                                      options={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? modelNumbers : vendors}
                                      onChange={handleInputChange(fieldName)}
                                      label={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? "Model Number" : "Vendor"}
                                      multiple={false}
                                      error={this.props.fieldErrors[fieldName]}
                                      defaultValue={(this.props.isEdit) ? this.props.subject.model ? this.props.subject.model[fieldName] : this.props.subject[fieldName] : ""}
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
            ModelFields.EquipmentModelFields.CALIBRATION_MODE
        ]

        let {formFields, generalError, fieldErrors} = this.props
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
                                <label htmlFor="validationServer01" className="grey-text form-label">{formFields[fieldKey]}</label>
                                <input
                                    type="text"
                                    className={fieldErrors[fieldKey] ? "form-control is-invalid" : "form-control"}
                                    id="validationServer01"
                                    placeholder={FormEnums.AllFieldPlaceHolders[fieldKey]}
                                    //required={FormEnums.AllFieldRequirementTypes[fieldKey] == FormEnums.FieldRequirementTypes.REQUIRED}
                                    onChange={(e) => this.props.handleInputChange(fieldKey)(e.target.value)}
                                    defaultValue={(this.props.isEdit) ? this.props.subject[fieldKey] : ""}
                                />
                                {fieldErrors[fieldKey] &&
                                    <div style={{fontSize : 13}} className="text-danger">{fieldErrors[fieldKey]}</div>
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