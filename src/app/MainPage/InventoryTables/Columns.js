import ModelFields from "../../../utils/enums";

export default class TableColumns {
    static MODEL_COLUMNS = [
        {
            label: 'Model Id',
            field: ModelFields.EquipmentModelFields.PK,
            sort: 'int',
            width: 150
        },
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
            label: 'Comment',
            field: ModelFields.EquipmentModelFields.COMMENT,
            sort: 'asc',
            width: 150
        },
        {
            label: 'Calibration Frequency',
            field: ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY,
            sort: 'int',
            width: 100
        }
    ]

    static INSTRUMENT_COLUMNS = [
        {
            label: 'Instrument Id',
            field: 'pk',
            sort: 'int',
            width: 150
        },
        {
            label: 'Vendor',
            field: 'vendor',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Model Number',
            field: 'model_number',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Serial Number',
            field: 'serial_number',
            sort: 'asc',
            width: 100
        },
        {
            label: 'Description',
            field: 'description',
            sort: 'asc',
            width: 100
        },
        {
            label: 'Comment',
            field: 'comment',
            sort: 'asc',
            width: 150
        }
    ]
}