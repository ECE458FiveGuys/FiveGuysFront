import ModelFields from "../../../../utils/enums";

export default class TableColumns {
    static MODEL_COLUMNS = [
        {
            label: 'Vendor',
            field: ModelFields.EquipmentModelFields.VENDOR,
            sort: 'asc',
            width: 270
        },
        {
            label: 'Model Number',
            field: ModelFields.EquipmentModelFields.MODEL_NUMBER,
            sort: 'asc',
            width: 200
        },
        {
            label: 'Description',
            field: ModelFields.EquipmentModelFields.DESCRIPTION,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Calibration Frequency',
            field: ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY,
            sort: 'int',
            width: 100
        },
        {
            label: 'Categories',
            field: ModelFields.EquipmentModelFields.MODEL_CATEGORIES,
            sort: 'asc',
            width: 100
        },
    ]

    static INSTRUMENT_COLUMNS = [
        {
            label: 'Vendor',
            field: ModelFields.EquipmentModelFields.VENDOR,
            sort: 'asc',
            width: 270
        },
        {
            label: 'Model Number',
            field: ModelFields.EquipmentModelFields.MODEL_NUMBER,
            sort: 'asc',
            width: 200
        },
        {
            label: 'Serial Number',
            field: ModelFields.InstrumentFields.SERIAL_NUMBER,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Asset Tag Number',
            field: ModelFields.InstrumentFields.ASSET_TAG,
            sort: 'int',
            width: 100
        },
        {
            label: 'Description',
            field: ModelFields.EquipmentModelFields.DESCRIPTION,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Most Recent Calibration',
            field: ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Calibration Expiration',
            field: ModelFields.InstrumentFields.EXPIRATION_DATE,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Model Categories',
            field: ModelFields.EquipmentModelFields.MODEL_CATEGORIES,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Instrument Categories',
            field: ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES,
            sort: 'asc',
            width: 100
        },
    ]

    static CATEGORY_COLUMNS = [
        {
            label: 'Category Name',
            field: ModelFields.CategoryFields.NAME,
            sort: 'asc',
            width: 270
        }
        ]
}