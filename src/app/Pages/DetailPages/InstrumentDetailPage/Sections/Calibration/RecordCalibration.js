import React, {Component} from "react";
import FormModal from "../../../../../Common/Forms/FormModal";
import ModelFields from "../../../../../../utils/enums";
import CalibrationRequests from "../../../../../../controller/requests/calibration_requests";
import {Instrument} from "../../../../../../utils/ModelEnums";
import {handleFieldValueChange} from "../../../../../Common/Inputs/input_utils";
import {UserError} from "../../../../../../controller/exceptions";
import MiscellaneousRequests from "../../../../../../controller/requests/miscellaneous_requests";

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'xlsx']

class RecordCalibration extends Component {
    constructor(props) {
        super(props);
        const today = new Date()
        this.state = {
            fields : {date : this.parseDate(today)}
        }
    }

    componentDidMount() {
        MiscellaneousRequests.getCalibratedWithOptions(this.props.token,
            (json) => this.setState({calibratedWithOptions : json}),
                    e => alert(e),
            this.props.instrument.pk)
        console.log(this.props.instrument.pk)
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
        let {calibratedWithOptions} = this.state
        let {date, comment, file, calibrated_with} = this.state.fields

        let editCallback = (response) => {
            this.props.closeModal()
            window.location.reload(false)
        }
        let calibrationError = (e) => {
            this.props.setError(e)
        }

        let calibratedWithPKs = []
        if (calibrated_with) {
            calibrated_with.forEach(assetTag => {
                    calibratedWithOptions.forEach(instrument => {
                        if (instrument[Instrument.FIELDS.ASSET_TAG] == parseInt(assetTag)) calibratedWithPKs.push(parseInt(instrument.pk))
                    })
                }
            )}

        try {
            this.validateSubmit()
            CalibrationRequests.recordCalibration(this.props.token, instrument.pk, date, user.id, comment, file,
                undefined, editCallback, calibrationError, undefined, calibratedWithPKs.length == 0 ? undefined : calibratedWithPKs)
        } catch (e) {
            this.props.setError(e.message)
        }
    }

    parseDate(day) {
        return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
    }

    handleDayClick = (day) => {
        let fields = this.state.fields
        if (!fields) fields = {}
        fields.date = this.parseDate(day)
        this.setState({fields: fields})
    }

    handleFileSelect = (e) => {
        let file = document.getElementById('additionalEvidence').files[0];
        let fields = this.state.fields
        if (!fields) fields = {}
        fields.file = file
        this.setState({fields : fields})
    }

    render() {
        let {generalError} = this.props
        let {calibratedWithOptions} = this.state
        return (calibratedWithOptions) ? <FormModal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    token={this.props.token}
                    submitMethod={this.handleSubmit}
                    fields={ModelFields.CalibrationFormFields}
                    title={"Record New Calibration Event for Instrument " + this.props.instrument[Instrument.FIELDS.ASSET_TAG]}
                    handleInputChange={handleFieldValueChange(this)}
                    isEdit={false}
                    calibratedWithOptions={calibratedWithOptions.map(instrument => instrument[Instrument.FIELDS.ASSET_TAG].toString())}
                    handleDayClick={this.handleDayClick}
                    handleFileSelect={this.handleFileSelect}
                    generalError={generalError}
                /> : <div/>
        }
}
export default RecordCalibration