import ModelFields from "../../../utils/enums";

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
        }
    ]

    static INSTRUMENT_COLUMNS = [
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
    ]
}