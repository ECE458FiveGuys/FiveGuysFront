import React, {Component} from "react";
import EditModal from "./EditModal";
import ModelFields from "../../../utils/enums";
import ModelRequests from "../../../controller/requests/model_requests";
import CalibrationRequests from "../../../controller/requests/calibration_requests";
import {handleFormChange} from "../../Common/Inputs/input_utils";
import {Instrument} from "../../../utils/ModelEnums";


class RecordCalibration extends Component {
    constructor(props) {
        super(props);
        const today = new Date()
        // let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.state = {
            date: this.parseDate(today),
        }
    }

    handleSubmit = () => {
        this.props.closeModal()
        let {instrument, user} = this.props
        let {date, comment, file} = this.state
        let editCallback = (response) => {
            window.location.reload(false)
        }
        let editError = (e) => {
            alert("CALIBRATION: "+e)
        }
        CalibrationRequests.recordCalibration(this.props.token, instrument.pk, date, user.id, comment, file, undefined, editCallback, editError)
    }

    parseDate(day) {
        return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
    }

    handleDayClick = (day) => {
        this.setState({date: this.parseDate(day)})
    }

    handleFileSelect = (e) => {
        let file = document.getElementById('additionalEvidence').files[0];
        this.setState({file : file})
    }

    render() {
        return (
            <EditModal
                show={this.props.show}
                onHide={this.props.onHide}
                token={this.props.token}
                submitMethod={this.handleSubmit}
                fields={ModelFields.CalibrationFormFields}
                title={"Record New Calibration Event for Instrument "+this.props.instrument[Instrument.FIELDS.ASSET_TAG]}
                handleFormChange={handleFormChange(this)}
                isEdit = {false}
                handleDayClick = {this.handleDayClick}
                handleFileSelect = {this.handleFileSelect}
            />
        );
    }
}
export default RecordCalibration