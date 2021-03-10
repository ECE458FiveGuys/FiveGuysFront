import React, {Component} from "react";
import FormModal from "../../../../../Common/Forms/FormModal";
import ModelFields from "../../../../../../utils/enums";
import CalibrationRequests from "../../../../../../controller/requests/calibration_requests";
import {Instrument} from "../../../../../../utils/ModelEnums";
import {handleFieldValueChange} from "../../../../../Common/Inputs/input_utils";
import {UserError} from "../../../../../../controller/exceptions";

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'xlsx']

class RecordCalibration extends Component {
    constructor(props) {
        super(props);
        const today = new Date()
        this.state = {
            fields : {date : this.parseDate(today)}
        }
    }

    validateSubmit = () => {
        let {date, comment, file} = this.state.fields
        let extension = file ? file.name.split(".").pop() : undefined
        if (comment && comment.length > 2000) {
            throw new UserError("Comment cannot be greater than 2000 characters")
        } else if (file && file.size > 32000000) {
            throw new UserError("File cannot be more than 32MB")
        } else if (extension && !ALLOWED_EXTENSIONS.includes(extension)) {
            throw new UserError("Extensions must be 'jpg', 'jpeg', 'png', 'gif', 'pdf', or 'xlsx'")
        }
    }

    handleSubmit = () => {
        let {instrument, user} = this.props
        let {date, comment, file} = this.state.fields

        let editCallback = (response) => {
            this.props.closeModal()
            window.location.reload(false)
        }
        let calibrationError = (e) => {
            this.setState({generalError : e})
        }

        try {
            this.validateSubmit()
            CalibrationRequests.recordCalibration(this.props.token, instrument.pk, date, user.id, comment, file, undefined, editCallback, calibrationError)
        } catch (e) {
            this.setState({generalError : e.message})
        }
    }

    parseDate(day) {
        return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
    }

    handleDayClick = (day) => {
        let fields = this.state
        if (!fields) fields = {}
        fields.date = this.parseDate(day)
        this.setState({fields: fields})
    }

    handleFileSelect = (e) => {
        let file = document.getElementById('additionalEvidence').files[0];
        let fields = this.state
        if (!fields) fields = {}
        fields.file = file
        this.setState({fields : fields})
    }

    render() {
        return (
            <FormModal
                show={this.props.show}
                onHide={this.props.onHide}
                token={this.props.token}
                submitMethod={this.handleSubmit}
                fields={ModelFields.CalibrationFormFields}
                title={"Record New Calibration Event for Instrument "+this.props.instrument[Instrument.FIELDS.ASSET_TAG]}
                handleInputChange={handleFieldValueChange(this)}
                isEdit = {false}
                handleDayClick = {this.handleDayClick}
                handleFileSelect = {this.handleFileSelect}
                generalError = {this.state.generalError}
            />
        );
    }
}
export default RecordCalibration