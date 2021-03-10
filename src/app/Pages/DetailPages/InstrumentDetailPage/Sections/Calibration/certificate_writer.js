import jsPDF from "jspdf";
import ModelFields from "../../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../../utils/ModelEnums";
import Image from "../../../../../../assets/hpt_logo.png"
import {IdealCurrents} from "../../../../LoadBankPage/Steps/LoadBankStepSteps/step_utils";

const LOGO_ASPECT_RATIO = 1.26
const IMAGE_HEIGHT = 80
const DIVIDER_WIDTH = IMAGE_HEIGHT * LOGO_ASPECT_RATIO

const INLINE_SUPPORT_EXTENSIONS = ["jpeg", "jpg", "gif", "png"]

export function createCertificate (instrument, user, calibrationEvent) {
    let certificate = new jsPDF()
    const pageWidth = certificate.internal.pageSize.getWidth();
    addImage(certificate, Image)
    certificate.line((pageWidth - DIVIDER_WIDTH) / 2, IMAGE_HEIGHT, (pageWidth + DIVIDER_WIDTH) / 2, IMAGE_HEIGHT)
    writeInstrumentDetails(certificate, user, instrument, calibrationEvent, pageWidth)
    let additionalEvidence = calibrationEvent[ModelFields.CalibrationFields.AdditionalFile]
    let loadBankData = calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.LoadBankFile]) : undefined
    additionalEvidence ? writeAdditionalEvidence(certificate, additionalEvidence) : loadBankData ? writeLoadBankSection(certificate, loadBankData) : console.log()
    certificate.save(`calibration_certificate_inst_${instrument[Instrument.FIELDS.ASSET_TAG]}.pdf`)
}

export function addImage(certificate, image, marginTop=0) {
    const pageWidth = certificate.internal.pageSize.getWidth();
    let imageHeight = IMAGE_HEIGHT
    let imageWidth = IMAGE_HEIGHT * LOGO_ASPECT_RATIO
    certificate.addImage(image, 'png', (pageWidth - imageWidth) / 2, marginTop, imageWidth, imageHeight)
}

function writeInstrumentDetails (pdf, user, instrument, calibrationEvent, pageWidth) {
    pdf.setFont("helvetica")
    pdf.setFontSize(30)
    pdf.setTextColor(0, 100, 0);
    pdf.text('CALIBRATION CERTIFICATE', pageWidth / 2, IMAGE_HEIGHT + 15, 'center');
    pdf.autoTable({
        head: [['Calibration Info', '']],
        margin: { top: IMAGE_HEIGHT + 25 },
        body: [['Model Number', instrument.model.model_number],
                ['Vendor', instrument.model.vendor],
                ['Short Description', instrument.model.description],
                ['Serial Number', instrument[ModelFields.InstrumentFields.SERIAL_NUMBER]],
                ['Asset Number', instrument[ModelFields.InstrumentFields.ASSET_TAG]],
                ['Most Recent Calibration', calibrationEvent[ModelFields.CalibrationFields.Date]],
                ['Calibration Expiration Date', instrument[Instrument.FIELDS.EXPIRATION_DATE]],
                ['Engineer', user.name]]
    })
}

function writeAdditionalEvidence (certificate, additionalEvidence) {
    // const extension = additionalEvidence.split(".").pop()
    // if (INLINE_SUPPORT_EXTENSIONS.includes(extension)) {
    //     const pageWidth = certificate.internal.pageSize.getWidth();
    //     certificate.text('ADDITIONAL EVIDENCE:', pageWidth / 2, 190, 'center');
    //     addImage(certificate, additionalEvidence)
    // }
    // else {
    //     certificate.autoTable({
    //         head: [['AdditionalEvidence']],
    //         body: [[additionalEvidence]]
    //     })
    // }
    certificate.autoTable({
        head: [['AdditionalEvidence']],
        body: [[additionalEvidence]]
    })
}

var getImageFromUrl = function(url, callback) {
    var img = new Image();
    img.onError = function() {alert('Cannot load image: "'+url+'"')}
    img.onload = function() {callback(img)}
    img.src = url;
}

export function writeLoadBankSection (certificate, loadBankData) {
    certificate.autoTable(
            {
                head: [['Visual Inspection', '[y/n]']],
                columnStyles: {1: {fillColor: [0, 250, 0]}},
                body: [['Visual inspection ok?', 'y']]
            }
    )
    let voltmeter = loadBankData.voltmeter
    let shuntMeter = loadBankData.shuntMeter
    certificate.autoTable(
            {
                head: [['Load Step Verification', 'Model Number', 'Asset Tag Number']],
                body: [['Voltmeter to be used', voltmeter[EquipmentModel.FIELDS.MODEL_NUMBER], voltmeter[Instrument.FIELDS.ASSET_TAG]],
                    ['Shunt Meter to be used', shuntMeter[EquipmentModel.FIELDS.MODEL_NUMBER], shuntMeter[Instrument.FIELDS.ASSET_TAG]]
                ]

            })
    let recordedCurrents = loadBankData.recordedCurrents
    certificate.autoTable(
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
            })
    let recordedVoltage = loadBankData.recordedVoltage
    certificate.autoTable(
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
        })
    certificate.autoTable(
            {
                head: [['Functional Checks', '[y/n]']],
                columnStyles: {1: {fillColor: [0, 250, 0]}},
                body: [['Low voltage cutoff', 'y'],
                    ['Cell voltage disconnect alarm', 'y'],
                    ['Recorded data ok', 'y'],
                    ['Printer ok', 'y']]
            }
    )
}