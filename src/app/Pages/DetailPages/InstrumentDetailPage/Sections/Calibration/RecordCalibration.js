import React, {Component} from "react";
import EditModal from "../../../Common/Popups/EditModal";
import ModelFields from "../../../../../../utils/enums";
import ModelRequests from "../../../../../../controller/requests/model_requests";
import CalibrationRequests from "../../../../../../controller/requests/calibration_requests";
import {handleFormChange} from "../../../../../Common/Inputs/input_utils";
import {Instrument} from "../../../../../../utils/ModelEnums";


class RecordCalibration extends Component {
    constructor(props) {
        super(props);
        const today = new Date()
        this.state = {
            date: this.parseDate(today),
        }
    }

    validateSubmit = () => {
        let {date, comment, file} = this.state
        let extension = file.name.split(".").pop()
        let allowedExtensions = ['jpg', 'png', 'gif', 'pdf', 'xlsx']
        if (comment && comment.length > 2000) {
            this.setState({error : "Comment cannot be greater than 2000 characters"})
            return;
        } else if (file.size > 32000000) {
            this.setState({error : "File cannot be more than 32MB"})
            return
        } else if (!allowedExtensions.includes(extension)) {
            this.setState({error : "Extensions must be 'jpg', 'png', 'gif', 'pdf', or 'xlsx'"})
            return
        }
    }

    handleSubmit = () => {
        let {instrument, user} = this.props
        let {date, comment, file} = this.state
        this.validateSubmit()
        let editCallback = (response) => {
            this.props.closeModal()
            window.location.reload(false)
        }
        let calibrationError = (e) => {
            this.setState({error : e})
        }
        CalibrationRequests.recordCalibration(this.props.token, instrument.pk, date, user.id, comment, file, undefined, editCallback, calibrationError)
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
                error = {this.state.error}
            />
        );
    }
}
export default RecordCalibration