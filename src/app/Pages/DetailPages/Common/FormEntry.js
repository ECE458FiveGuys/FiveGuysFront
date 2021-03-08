import React, {Component, useState} from "react";
import DayPicker from "react-day-picker";
import HTPMultiLineInput from "../../../Common/Inputs/HTPMultiLineInput";
import ModelFields from "../../../../utils/enums";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";
import FileUtils from "../../../../utils/file_utils";
import Checkbox from "../../../Common/Tables/TableWidgets/Checkbox";

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
                <div className="custom-control custom-checkbox">
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
                </div>
            )
        }

        if (fieldName === ModelFields.InstrumentFields.COMMENT) {
            return (
                <HTPMultiLineInput onChange={(area) => this.props.handleInputChange(ModelFields.CalibrationFields.Comment)(area.target.value)}
                                   label={"Any comments?"}
                                   name={ModelFields.CalibrationFormFields.Comment}
                                   defaultValue={(this.props.isEdit) ? this.props.subject[fieldName] : ""}
                                   placeholder={"Share your thoughts"}/>
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
                <HTPAutoCompleteInput placeholder={fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ? "Model Categories" : "Instrument Categories"}
                                      options={fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ? modelCategories : instrumentCategories}
                                      onChange={handleInputChange(fieldName)}
                                      label={fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ? "Model Categories" : "Instrument Categories"}
                                      multiple={true}
                                        defaultValue={ this.props.subject ? ((this.props.isEdit) ?
                                                                      this.props.subject[fieldName] : "") : ""}
                                        size={13}/>
            )
        }

        if (fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER || fieldName === ModelFields.EquipmentModelFields.VENDOR){
            let {vendors, modelNumbers, handleInputChange} = this.props
            return(
                <HTPAutoCompleteInput placeholder={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? "Model Number" : "Vendor"}
                                      options={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? modelNumbers : vendors}
                                      onChange={handleInputChange(fieldName)}
                                      label={fieldName === ModelFields.EquipmentModelFields.MODEL_NUMBER ? "Model Number" : "Vendor"}
                                      multiple={false}
                                      defaultValue={(this.props.isEdit) ? this.props.subject.model ? this.props.subject.model[fieldName] : this.props.subject[fieldName] : ""}
                                      size={13}/>
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

        let formFields = this.props.fields
        return(
            <div>
                {Object.keys(formFields).map((fieldKey, index) => (
                    AlternateInputs.includes(fieldKey) ? (
                        <div>
                            {this.renderAlternateInputs(fieldKey)}
                        </div>): (
                    <div>
                    <label className={"grey-text"}>{formFields[fieldKey]}</label>
                    <input name={fieldKey}
                           aria-multiline={true}
                           placeholder={formFields[fieldKey]}
                            className="form-control"
                            onChange={(e) => this.props.handleInputChange(fieldKey)(e.target.value)}
                            defaultValue={(this.props.isEdit) ? this.props.subject[fieldKey] : ""}
                    />
                    <br />
                    </div>
                    )
                ))}
            </div>
        );}
}
export default FormEntry