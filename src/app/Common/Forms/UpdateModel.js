import React from "react";
import UpdateInventory from "./UpdateInventory";
import {UserError} from "../../../controller/exceptions";
import {isNumeric} from "../../Pages/LoadBankPage/utils";
import ModelFields from "../../../utils/enums";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import * as PropTypes from "prop-types";
import ModelRequests from "../../../controller/requests/model_requests";

export default class UpdateModel extends React.Component {

    static EDIT_MODE = "EDIT"
    static CREATE_MODE = "CREATE"

    constructor(props) {
        super(props);
    }

    refreshFields = (mode, model) => {
        return {
            vendor: mode == UpdateModel.EDIT_MODE ? model.vendor : undefined,
            model_number: mode == UpdateModel.EDIT_MODE ? model.model_number : undefined,
            description: mode == UpdateModel.EDIT_MODE ? model.description : undefined,
            model_categories: mode == UpdateModel.EDIT_MODE ? model.model_categories : undefined,
            comment: mode == UpdateModel.EDIT_MODE ? model.comment : undefined,
            calibration_mode :  mode == UpdateModel.EDIT_MODE ? model.calibration_mode : undefined,
            calibration_frequency :  mode == UpdateModel.EDIT_MODE ? model.calibration_frequency : undefined,
            error: undefined,
            createdModel: undefined
        }
    }

    validateFields = (fields) => {
        let {vendor, model_number, description, comment, calibration_frequency, calibration_mode} = fields
        if (!vendor || !model_number || !description) {
            throw new UserError("Nice try! Vendor, model number, and description are required fields")
        } else if (calibration_frequency && (!isNumeric(calibration_frequency.toString()) || calibration_frequency < 0 || Math.ceil(calibration_frequency) != calibration_frequency)) {
            throw new UserError("Calibration frequency must be a positive integer")
        } else if (comment && comment.length > 100) {
            throw new UserError("Description cannot be greater than 100 characters")
        } else if (description.length > 2000) {
            throw new UserError("Comment cannot be greater than 2000 characters")
        } else if (!calibration_frequency && calibration_mode == ModelFields.CalibrationModes.LOAD_BANK) {
            throw new UserError("If the load bank wizard is enabled, the model must have a calibration frequency")
        }
    }

    render() {
        let {token, model, history, updatePageState, mode} = this.props
        return <UpdateInventory token={token}
                                subject={model}
                                updatePageState={updatePageState}
                                history={history}
                                inventoryType={ModelFields.ModelTypes.EQUIPMENT_MODEL}
                                mode={mode}
                                createFunction={ModelRequests.createModelWithFields}
                                editFunction={ModelRequests.editModelWithFields}
                                retrieveFunction={ModelRequests.retrieveModel}
                                refreshFields={this.refreshFields}
                                validateFields={this.validateFields}
        />
    }
}


UpdateModel.propTypes = {
    token : PropTypes.string.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    mode : PropTypes.string.isRequired,
    model : PropTypes.object.isRequired
}