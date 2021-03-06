import ModelDisplay from "./HTPModelDisplay";
import ModelFields from "../../../utils/enums";
import {parseDate} from "../../utils";
import {Instrument} from "../../../utils/ModelEnums";

export default function InstrumentDisplay(instrument) {
    let mostRecentCalbrationDate = instrument['calibration_history'][0][ModelFields.CalibrationFields.Date]
    return ModelDisplay(["Model Number", "Vendor", "Serial Number", "Asset Tag", "Most Recent Calibration", "Calibration Expiration"],
    [
        instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.MODEL_NUMBER],
        instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.VENDOR],
        instrument[ModelFields.InstrumentFields.SERIAL_NUMBER],
        instrument[ModelFields.InstrumentFields.ASSET_TAG],
        mostRecentCalbrationDate,
        instrument[Instrument.FIELDS.EXPIRATION_DATE]
    ], ['green', 'green', 'green', 'green', 'green', parseDate(instrument[Instrument.FIELDS.EXPIRATION_DATE])])
}