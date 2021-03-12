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
            sortNone: () => {},
            width: 100
        },
    ]

    static INSTRUMENT_COLUMNS = [
        {
            label: 'Vendor',
            field: ModelFields.InstrumentSearchFields.Vendor,
            sort: 'asc',
            width: 270
        },
        {
            label: 'Model Number',
            field: ModelFields.InstrumentSearchFields["Model Number"],
            sort: 'asc',
            width: 200
        },
        {
            label: 'Asset Tag Number',
            field: ModelFields.InstrumentFields.ASSET_TAG,
            sort: 'int',
            width: 100
        },
        {
            label: 'Description',
            field: ModelFields.InstrumentSearchFields.Description,
            sort: 'asc',
            width: 100
        },
        {
            label: 'Serial Number',
            field: ModelFields.InstrumentFields.SERIAL_NUMBER,
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

    static CALIBRATION_COLUMNS = [
        {
            label: 'Date',
            field: 'date',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Comment',
            field: 'comment',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Additonal Evidence',
            field: 'additional_evidence',
            sort: 'asc',
            width: 270
        }
    ]

    static USER_COLUMNS = [
        {
            label: 'Username',
            field: ModelFields.UserFields.USERNAME,
            sort: 'asc',
            width: 150
        },
        {
            label: 'Name',
            field: ModelFields.UserFields.NAME,
            sort: 'asc',
            width: 50
        },
        {
            label: 'Email',
            field: ModelFields.UserFields.EMAIL,
            sort: 'asc',
            width: 50
        },
        {
            label: 'Permissions',
            field: ModelFields.UserFields.IS_STAFF,
            sort: 'asc',
            width: 50
        },
        {
            label: 'Options',
            field: 'options',
            sort: 'asc',
            width: 50
        },
    ]

    static USER_COLUMNS_EDITABLE = [
        {
            label: 'Name',
            field: ModelFields.UserFields.NAME,
            sort: 'asc',
            width: 150
        },
        {
            label: 'Email',
            field: ModelFields.UserFields.EMAIL,
            sort: 'asc',
            width: 150
        },
        {
            label: 'Activity',
            field: ModelFields.UserFields.ACTIVITY,
            sort: 'asc',
            width: 150
        },
        {
            label: 'ID',
            field: ModelFields.UserFields.ID,
            sort: 'asc',
            width: 150
        },
        {
            label: 'Password',
            field: 'password',
            sort: 'asc',
            width: 150
        },

        {
            label: 'Admin Privilege',
            field: ModelFields.UserFields.IS_STAFF,
            sort: 'asc',
            width: 150
        },
    ]
}