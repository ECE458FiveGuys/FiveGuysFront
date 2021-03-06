import jsPDF from "jspdf";
import ModelFields from "../../../utils/enums";
import {getCurrentDate} from "../../utils";
import {IdealCurrents} from "./Steps/LoadBankStepSteps/step_utils";
import 'jspdf-autotable'
import {EquipmentModel, Instrument} from "../../../utils/ModelEnums";


export let writeLoadBankTableData = (loadBank, voltmeter, shuntMeter, user, recordedCurrents, recordedVoltage) => {
    return {
        visualInspection:
            {
                head: [['Visual Inspection', '[y/n]']],
                columnStyles: {1: {fillColor: [0, 250, 0]}},
                body: [['Visual inspection ok?', 'y']]
            },
        meterInitialization:
            {
                head: [['Load Step Verification', 'Model Number', 'Asset Tag Number']],
                body: [['Voltmeter to be used', voltmeter[EquipmentModel.FIELDS.MODEL_NUMBER], voltmeter[Instrument.FIELDS.ASSET_TAG]],
                    ['Shunt Meter to be used', shuntMeter[EquipmentModel.FIELDS.MODEL_NUMBER], shuntMeter[Instrument.FIELDS.ASSET_TAG]]
                ],

            },
        loadBankCurrents:
            {
                head: [['Load Level',
                    'CR: Current reported [A]\n(from display)',
                    'CA: Current actual [A]\n(from shunt meter)',
                    'CR: Accepted Range [A]',
                    'CA: Accepted Range [A]',
                    'ok?'
                ]],
                columnStyles: {5: {fillColor: [0, 250, 0]}},
                body: Object.keys(recordedCurrents).map(stepName => {
                    let recordedCurrent = recordedCurrents[stepName]
                    return [stepName,
                        recordedCurrent.CR,
                        recordedCurrent.CA,
                        `${(IdealCurrents[stepName] * .97).toFixed(1)}-${(IdealCurrents[stepName] * 1.03).toFixed(1)}`,
                        `${(IdealCurrents[stepName] * .95).toFixed(1)}-${(IdealCurrents[stepName] * 1.05).toFixed(1)}`,
                        'ok']
                })
            },
        loadBankVoltages:
            {
                head: [['Voltage Level',
                    'VR: Voltage reported [V]\n(from display)',
                    'VA: Voltage actual [V]\n(from voltmeter)',
                    'VR: Accepted range [V]',
                    'VA: Accepted range [V]',
                    'ok?']],
                columnStyles: {5: {fillColor: [0, 250, 0]}},
                body: [[
                    'Voltages with all banks on',
                    recordedVoltage.VR,
                    recordedVoltage.VA,
                    `${(48 * .99).toFixed(1)}-${(48 * 1.01).toFixed(1)}`,
                    `${(48 * .90).toFixed(1)}-${(48 * 1.10).toFixed(1)}`,
                    'ok']]
            },
        functionalChecks:
            {
                head: [['Functional Checks', '[y/n]']],
                columnStyles: {1: {fillColor: [0, 250, 0]}},
                body: [['Low voltage cutoff', 'y'],
                    ['Cell voltage disconnect alarm', 'y'],
                    ['Recorded data ok', 'y'],
                    ['Printer ok', 'y']]
            }
    }
}