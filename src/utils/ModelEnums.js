import ModelFields from "./enums";

export const EquipmentModel = {
    TYPE : "model",
    FIELDS : ModelFields.EquipmentModelFields,
    SEARCH_FIELDS : ModelFields.EquipmentModelSearchFields
}

export const Instrument = {
    TYPE : "instrument",
    FIELDS : ModelFields.InstrumentFields,
    SEARCH_FIELDS : ModelFields.InstrumentSearchFields
}

export const Models = {
    EQUIPMENT_MODEL : EquipmentModel,
    INSTRUMENT : Instrument
}

