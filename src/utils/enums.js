export default class ModelFields {

    static EquipmentModelFields = {
        VENDOR: "vendor",
        MODEL_NUMBER: "model_number",
        DESCRIPTION: "description",
        PK: "pk",
        COMMENT: "comment",
        CALIBRATION_FREQUENCY: "calibration_frequency"
    }

    static EquipmentModelSearchFields = {
        "Vendor": ModelFields.EquipmentModelFields.VENDOR,
        "Model Number": ModelFields.EquipmentModelFields.MODEL_NUMBER,
        "Description": ModelFields.EquipmentModelFields.DESCRIPTION
    }

    static InstrumentFields = {
        PK : "pk",
        MODEL: "model",
        SERIAL_NUMBER: "serial_number",
        COMMENT: "comment",
        MOST_RECENT_CALIBRATION : "most_recent_calibration_date",
        EXPIRATION_DATE : "calibration_expiration_date"
    }

    static InstrumentSearchFields = {
        ...ModelFields.EquipmentModelSearchFields,
        ...{
            "Serial Number": ModelFields.InstrumentFields.SERIAL_NUMBER
        }
    }
}
