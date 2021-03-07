export const StorageKeys = {
    TOKEN : "token",
    USER : "user"
}

export default class ModelFields {

    static UserFields = {
        NAME: "name",
        EMAIL : "email",
        ACTIVITY : "is_active",
        ID : "id",
        USERNAME : "username",
        IS_STAFF : "is_staff"
    }

    static EquipmentModelFields = {
        VENDOR: "vendor",
        MODEL_NUMBER: "model_number",
        DESCRIPTION: "description",
        PK: "pk",
        COMMENT: "comment",
        CALIBRATION_FREQUENCY: "calibration_frequency",
        MODEL_CATEGORIES: "model_categories",
        CALIBRATION_MODE: "calibration_mode"
    }

    static EquipmentModelSearchFields = {
        "Vendor": ModelFields.EquipmentModelFields.VENDOR,
        "Model Number": ModelFields.EquipmentModelFields.MODEL_NUMBER,
        "Description": ModelFields.EquipmentModelFields.DESCRIPTION,
        "Categories": ModelFields.EquipmentModelFields.MODEL_CATEGORIES
    }

    static EquipmentModelEditFields = {
        "Vendor": ModelFields.EquipmentModelFields.VENDOR,
        "Model Number": ModelFields.EquipmentModelFields.MODEL_NUMBER,
        "Description": ModelFields.EquipmentModelFields.DESCRIPTION,
        "Comment": ModelFields.EquipmentModelFields.COMMENT,
        "Categories": ModelFields.EquipmentModelFields.MODEL_CATEGORIES,
        "Calibration Frequency": ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY,
    }

    static InstrumentFields = {
        PK : "pk",
        MODEL: "model",
        SERIAL_NUMBER: "serial_number",
        COMMENT: "comment",
        MOST_RECENT_CALIBRATION : "most_recent_calibration_date",
        EXPIRATION_DATE : "calibration_expiration_date",
        ASSET_TAG : "asset_tag_number",
        INSTRUMENT_CATEGORIES : "instrument_categories"
    }

    static InstrumentSearchFields = {
        "Vendor": "model__" + ModelFields.EquipmentModelFields.VENDOR,
        "Model Number": "model__" + ModelFields.EquipmentModelFields.MODEL_NUMBER,
        "Description": "model__" + ModelFields.EquipmentModelFields.DESCRIPTION,
        "Serial Number": ModelFields.InstrumentFields.SERIAL_NUMBER,
        "Asset Tag" : ModelFields.InstrumentFields.ASSET_TAG,
        "Model Categories": ModelFields.EquipmentModelFields.MODEL_CATEGORIES,
        "Instrument Categories": ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES
    }

    static InstrumentEditFields = {
        [ModelFields.EquipmentModelFields.MODEL_NUMBER] : "Model Number",
        [ModelFields.EquipmentModelFields.VENDOR] : "Vendor",
        [ModelFields.InstrumentFields.SERIAL_NUMBER] : "Serial Number",
        [ModelFields.InstrumentFields.ASSET_TAG] : "Asset Tag",
        [ModelFields.InstrumentFields.COMMENT] : "Comment",
        [ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] : "Instrument Categories"
    }

    static CategoryFields = {
        PK : "pk",
        NAME : "name"
    }

    static ModelTypes = {
        EQUIPMENT_MODEL : "model",
        INSTRUMENT : "instrument",
        USER : "user"
    }

    static CalibrationFields = {
        "User": "user",
        "Instrument": "instrument",
        "Date" : "date",
        "Comment" : "comment",
        "LoadBankFile" : "load_bank_data",
        "AdditionalFile" : "additional_evidence"
    }

    static CalibrationFormFields = {
        "date" : "Date",
        "comment" : "Comment",
        "additional_evidence" : "Additional Evidence"
    }

    static CalibrationModes = {
        NOT_CALIBRATABLE : "NOT_CALIBRATABLE",
        DEFAULT : "DEFAULT",
        LOAD_BANK : "LOAD_BANK"
    }
}
