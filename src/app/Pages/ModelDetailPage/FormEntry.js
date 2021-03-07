import React, {Component, useState} from "react";
import SelectInput from "./SelectInput";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ModelRequests from "../../../controller/requests/model_requests";
import DatePickers from "../../Common/DatePickers";
import DayPicker from "react-day-picker";
import HTPMultiLineInput from "../../Common/Inputs/HTPMultiLineInput";
import ModelFields from "../../../utils/enums";
import HTPAutoCompleteInput from "../../Common/Inputs/HTPAutoCompleteInput";

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
                        {/*<div className="input-group-prepend">*/}
                        {/*    <span className="input-group-text" id="additionalEvidenceAddon01">*/}
                        {/*      Upload*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="additionalEvidence"
                                aria-describedby="additionalEvidenceAddon01"
                                onChange={event => {
                                    this.props.handleFileSelect(event)
                                    let filename = event.target.value.split("\\").pop();
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
                                        defaultValue={(this.props.isEdit) ?
                                                      fieldName === ModelFields.EquipmentModelFields.MODEL_CATEGORIES ?
                                                      this.props.subject.model[fieldName] :
                                                          this.props.subject[fieldName] : ""}
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
                                      defaultValue={(this.props.isEdit) ? this.props.subject.model[fieldName] : ""}
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
            ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES
        ]

        // let models = ModelRequests.getModels()
        let formFields = this.props.fields
        // let test = this.props.subject[formFields["model"]]
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
                            className="form-control"
                            onChange={this.props.handleFormChange}
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