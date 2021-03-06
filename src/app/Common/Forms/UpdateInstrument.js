import React from "react";
import UpdateInventory from "./UpdateInventory";
import {UserError} from "../../../controller/exceptions";
import {isNumeric} from "../../Pages/LoadBankPage/utils";
import ModelFields from "../../../utils/enums";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import * as PropTypes from "prop-types";
import {Instrument} from "../../../utils/ModelEnums";

export default class UpdateInstrument extends React.Component {

    static EDIT_MODE = "EDIT"
    static CREATE_MODE = "CREATE"

    constructor(props) {
        super(props);
    }

    refreshFields = (mode, instrument) => {
        return {
            vendor: mode == UpdateInventory.EDIT_MODE ? instrument.model.vendor : undefined,
            model_number: mode == UpdateInventory.EDIT_MODE ? instrument.model.model_number : undefined,
            serial_number: mode == UpdateInventory.EDIT_MODE ? instrument.serial_number : undefined,
            comment: mode == UpdateInventory.EDIT_MODE ? instrument.comment : undefined,
            asset_tag_number: mode == UpdateInventory.EDIT_MODE ? instrument.asset_tag_number : undefined,
            instrument_categories: mode == UpdateInventory.EDIT_MODE ? instrument.instrument_categories : undefined,
        }
    }

    validateFields = (fields) => {
        let {model_number, vendor, serial_number, comment, asset_tag_number, instrument_categories} = fields
        let fieldErrors = {}
        if (asset_tag_number && (!isNumeric(asset_tag_number.toString()) || parseInt(asset_tag_number) > 999999 || parseInt(asset_tag_number) < 100000)) {
            fieldErrors.asset_tag_number = "Asset tag must be a 6 digit number"
        } else if (comment && comment.length > 2000) {
            fieldErrors.comment = "Comment cannot be greater than 2000 characters"
        }
        return fieldErrors
    }

    render() {
        let {token, instrument, history, updatePageState, mode, existingFields} = this.props
        // if edit mode, make asset tag field fixed and disabled
        let fullExistingFields = mode === UpdateInventory.EDIT_MODE ?
            {...existingFields, ...{[Instrument.FIELDS.ASSET_TAG] : instrument[Instrument.FIELDS.ASSET_TAG]}} :
            {...existingFields}
        return <UpdateInventory token={token}
                                subject={instrument}
                                updatePageState={updatePageState}
                                history={history}
                                inventoryType={ModelFields.ModelTypes.INSTRUMENT}
                                mode={mode}
                                createFunction={InstrumentRequests.createInstrumentWithFields}
                                editFunction={InstrumentRequests.editInstrumentWithFields}
                                retrieveFunction={InstrumentRequests.retrieveInstrument}
                                refreshFields={this.refreshFields}
                                validateFields={this.validateFields}
                                existingFields={fullExistingFields}
        />
    }
}

UpdateInstrument.propTypes = {
    token : PropTypes.string.isRequired,
    updatePageState : PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    mode : PropTypes.string.isRequired,
    existingFields : PropTypes.object
}

