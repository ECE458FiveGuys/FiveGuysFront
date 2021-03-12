import ModelDisplay from "./HTPModelDisplay";
import ModelFields from "../../../utils/enums";
import {parseDate} from "../../utils";
import {Instrument} from "../../../utils/ModelEnums";

export default function InstrumentDisplay(instrument) {
    let calib_history = instrument['calibration_history']
    let mostRecentCalbrationDate = calib_history.length > 0 ? calib_history[0][ModelFields.CalibrationFields.Date] : "None yet!"
    return ModelDisplay(["Model Number", "Vendor", "Serial Number", "Asset Tag", "Most Recent Calibration", "Calibration Expiration"],
    [
        instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.MODEL_NUMBER],
        instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.VENDOR],
        instrument[ModelFields.InstrumentFields.SERIAL_NUMBER],
        instrument[ModelFields.InstrumentFields.ASSET_TAG],
        mostRecentCalbrationDate,
        instrument[Instrument.FIELDS.EXPIRATION_DATE]
    ])
}