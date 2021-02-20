export default class ModelFields {

    static EquipmentModelSearchFields = {
        VENDOR: "vendor",
        MODEL_NUMBER: "model_number",
        DESCRIPTION: "description",
    }

    static EquipmentModelFields = {
        ...ModelFields.EquipmentModelSearchFields,
        ...{
            PK: "pk",
            COMMENT: "comment",
            CALIBRATION_FREQUENCY: "calibration_frequency"
        }
    }
}
