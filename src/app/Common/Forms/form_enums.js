import ModelFields from "../../../utils/enums";

export class FormEnums {

    static FieldRequirementTypes = {
        OPTIONAL : "optional",
        REQUIRED : 'required'
    }

    static FieldPlaceHolders = {
        OPTIONAL_STRING : "Optional",
        OPTIONAL_INT : "Optional (integer)",
        OPTIONAL_MULTIPLE : "Choose Multiple (optional)",
        COMMENT : "Share your thoughts (optional)",
        REQUIRED : 'Required',
        ASSET_TAG : "Optional (6 Digit Integer)"
    }

    // Models:

    static EquipmentModelFieldRequirementTypes = {
        [ModelFields.EquipmentModelFields.VENDOR] : FormEnums.FieldRequirementTypes.REQUIRED,
        [ModelFields.EquipmentModelFields.MODEL_NUMBER] : FormEnums.FieldRequirementTypes.REQUIRED,
        [ModelFields.EquipmentModelFields.DESCRIPTION] : FormEnums.FieldRequirementTypes.REQUIRED,
        [ModelFields.EquipmentModelFields.COMMENT] : FormEnums.FieldRequirementTypes.OPTIONAL,
        [ModelFields.EquipmentModelFields.MODEL_CATEGORIES] : FormEnums.FieldRequirementTypes.OPTIONAL,
        [ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] : FormEnums.FieldRequirementTypes.OPTIONAL,
        [ModelFields.EquipmentModelFields.CALIBRATION_MODE] : FormEnums.FieldRequirementTypes.OPTIONAL,
    }

    static EquipmentModelFieldPlaceHolders = {
        [ModelFields.EquipmentModelFields.VENDOR] : FormEnums.FieldPlaceHolders.REQUIRED,
        [ModelFields.EquipmentModelFields.MODEL_NUMBER] : FormEnums.FieldPlaceHolders.REQUIRED,
        [ModelFields.EquipmentModelFields.DESCRIPTION] : FormEnums.FieldPlaceHolders.REQUIRED,
        [ModelFields.EquipmentModelFields.COMMENT] : FormEnums.FieldPlaceHolders.COMMENT,
        [ModelFields.EquipmentModelFields.MODEL_CATEGORIES] : FormEnums.FieldPlaceHolders.OPTIONAL_MULTIPLE,
        [ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] : FormEnums.FieldPlaceHolders.OPTIONAL_INT,
        [ModelFields.EquipmentModelFields.CALIBRATION_MODE] : FormEnums.FieldPlaceHolders.OPTIONAL_STRING
    }

    static EquipmentModelFieldNames = {
        [ModelFields.EquipmentModelFields.VENDOR] : "Vendor",
        [ModelFields.EquipmentModelFields.MODEL_NUMBER] : "Model Number",
        [ModelFields.EquipmentModelFields.DESCRIPTION] : "Description",
        [ModelFields.EquipmentModelFields.COMMENT] : "Comment",
        [ModelFields.EquipmentModelFields.MODEL_CATEGORIES] : "Categories",
        [ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] : "Calibration Frequency",
        [ModelFields.EquipmentModelFields.CALIBRATION_MODE] : "Load Bank Wizard Supported?"
    }

    // Instruments:

    static InstrumentFieldNames = {
        [ModelFields.EquipmentModelFields.MODEL_NUMBER] : "Model Number",
        [ModelFields.EquipmentModelFields.VENDOR] : "Vendor",
        [ModelFields.InstrumentFields.SERIAL_NUMBER] : "Serial Number",
        [ModelFields.InstrumentFields.ASSET_TAG] : "Asset Tag",
        [ModelFields.InstrumentFields.COMMENT] : "Comment",
        [ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] : "Instrument Categories"
    }

    static InstrumentFieldPlaceHolders = {
        [ModelFields.InstrumentFields.SERIAL_NUMBER] : FormEnums.FieldPlaceHolders.OPTIONAL_STRING,
        [ModelFields.InstrumentFields.ASSET_TAG] : FormEnums.FieldPlaceHolders.ASSET_TAG,
        [ModelFields.InstrumentFields.COMMENT] : FormEnums.FieldPlaceHolders.COMMENT,
        [ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] : FormEnums.FieldPlaceHolders.OPTIONAL_MULTIPLE
    }

    static InstrumentFieldRequirementTypes = {
        [ModelFields.InstrumentFields.SERIAL_NUMBER] : FormEnums.FieldRequirementTypes.OPTIONAL,
        [ModelFields.InstrumentFields.ASSET_TAG] : FormEnums.FieldPlaceHolders.OPTIONAL,
        [ModelFields.InstrumentFields.COMMENT] : FormEnums.FieldRequirementTypes.OPTIONAL,
        [ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] : FormEnums.FieldRequirementTypes.OPTIONAL,
    }

    // All:

    static AllFieldRequirementTypes = {
        ...FormEnums.EquipmentModelFieldRequirementTypes,
        ...FormEnums.InstrumentFieldRequirementTypes
    }

    static AllFieldPlaceHolders = {
        ...FormEnums.EquipmentModelFieldPlaceHolders,
        ...FormEnums.InstrumentFieldPlaceHolders
    }

}