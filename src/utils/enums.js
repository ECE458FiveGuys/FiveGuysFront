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
        IS_STAFF : "is_staff",
        USER_CATEGORIES: "user_categories",
        GROUPS : "groups"
    }

    static EquipmentModelFields = {
        VENDOR: "vendor",
        MODEL_NUMBER: "model_number",
        DESCRIPTION: "description",
        PK: "pk",
        COMMENT: "comment",
        CALIBRATION_FREQUENCY: "calibration_frequency",
        MODEL_CATEGORIES: "model_categories",
        CALIBRATION_MODE: "calibration_mode",
        CALIBRATION_APPROVAL_REQUIRED : "approval_required",
        CALIBRATOR_CATEGORIES : "calibrator_categories"
    }

    static EquipmentModelSearchFields = {
        "Vendor": ModelFields.EquipmentModelFields.VENDOR,
        "Model Number": ModelFields.EquipmentModelFields.MODEL_NUMBER,
        "Description": ModelFields.EquipmentModelFields.DESCRIPTION,
        "Categories": ModelFields.EquipmentModelFields.MODEL_CATEGORIES
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
        "AdditionalFile" : "additional_evidence",
        "HardwareCalibrationFile" : "guided_hardware_data",
        ApprovalData : "approval_data",
        CalibratedWith : "calibrated_with"
    }

    static CalibrationFormFields = {
        "date" : "Date",
        "comment" : "Comment",
        "additional_evidence" : "Additional Evidence",
        [ModelFields.CalibrationFields.CalibratedWith] : "Calibrated With"
    }

    static CalibrationModes = {
        NOT_CALIBRATABLE : "NOT_CALIBRATABLE",
        DEFAULT : "DEFAULT",
        LOAD_BANK : "LOAD_BANK",
        GUIDED_HARDWARE : "GUIDED_HARDWARE",
        CUSTOM_FORM : "CUSTOM_FORM"
    }

    static ApprovalDataFields = {
        IS_APPROVED : "approved",
        APPROVER : "approver",
        DATE : "date",
        COMMENT : "comment"
    }
}

export class MiscellaneousEnums {

    static KNOWN_CATEGORIES = {
        KLUFE : "Klufe-K5700-compatible-calibrators",
        VOLTMETER : "voltmeter",
        SHUNT_METER : "shunt-meter"
    }
}