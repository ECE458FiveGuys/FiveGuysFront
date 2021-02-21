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
        MODEL: "model",
        SERIAL_NUMBER: "serial_number",
        COMMENT: "comment",
    }

    static InstrumentSearchFields = {
        ...ModelFields.EquipmentModelSearchFields,
        ...{
            "Serial Number": ModelFields.InstrumentFields.SERIAL_NUMBER
        }
    }
}
