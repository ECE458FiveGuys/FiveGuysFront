import {EquipmentModel} from "../../../utils/ModelEnums";
import ModelFields from "../../../utils/enums";

export function instrumentCalibratable (instrument) {
    return instrument.model[EquipmentModel.FIELDS.CALIBRATION_MODE] != ModelFields.CalibrationModes.NOT_CALIBRATABLE
}
