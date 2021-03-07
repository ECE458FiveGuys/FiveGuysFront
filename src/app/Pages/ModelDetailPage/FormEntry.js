import React, {Component, useState} from "react";
import SelectInput from "./SelectInput";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ModelRequests from "../../../controller/requests/model_requests";
import DatePickers from "../../Common/DatePickers";
import DayPicker from "react-day-picker";
import HTPMultiLineInput from "../../Common/Inputs/HTPMultiLineInput";
import ModelFields from "../../../utils/enums";

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
        if (fieldName === "Date") {
            const today = new Date();
            return ( <DayPicker
                        formatDate={'YYYY-MM-DD'}
                        disabledDays={{ after: today }}
                        selectedDays={this.state.selectedDay}
                        onDayClick={this.handleDayClick}
                    />);

        }

        if (fieldName === "Comment") {
            return (
                <HTPMultiLineInput onChange={this.props.handleFormChange}
                                   label={"Comment"}
                                   name={ModelFields.CalibrationFormFields.Comment}
                                   placeholder={"Comment"}/>
            )
        }

        if(fieldName === "File"){
            return (
                <div className="input-group">
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
            );
        }
        if(fieldName === "Model"){
            return(
                <div>
                    <label>{fieldName}</label>
                    <Select
                        defaultValue = {{value: "",label: "5"}}
                        options = {[{value: "",label: "2"}]}
                    />
                </div>
            );
        }
    }

    render() {
        let AlternateInputs = [
            "Model",
            "Date",
            "File",
            "Comment",
        ]

        // let models = ModelRequests.getModels()
        let formFields = this.props.fields
        // let test = this.props.subject[formFields["model"]]
        return(
            <div>
                {Object.keys(formFields).map((fieldName, index) => (
                    AlternateInputs.includes(fieldName) ? (
                        <div>
                            {this.renderAlternateInputs(fieldName)}
                        </div>): (
                    <div>
                    <label>{fieldName}</label>
                    <input name={formFields[fieldName]}
                           aria-multiline={true}
                            className="form-control"
                            onChange={this.props.handleFormChange}
                            defaultValue={(this.props.isEdit) ? this.props.subject[formFields[fieldName]] : ""}
                    />
                    <br />
                    </div>
                    )
                ))}
            </div>
        );}
}
export default FormEntry