import ModelFields from "./enums";

export const EquipmentModel = {
    TYPE : ModelFields.ModelTypes.EQUIPMENT_MODEL,
    FIELDS : ModelFields.EquipmentModelFields,
    SEARCH_FIELDS : ModelFields.EquipmentModelSearchFields
}

export const Instrument = {
    TYPE : ModelFields.ModelTypes.INSTRUMENT,
    FIELDS : ModelFields.InstrumentFields,
    SEARCH_FIELDS : ModelFields.InstrumentSearchFields
}

export const Models = {
    EQUIPMENT_MODEL : EquipmentModel,
    INSTRUMENT : Instrument
}

