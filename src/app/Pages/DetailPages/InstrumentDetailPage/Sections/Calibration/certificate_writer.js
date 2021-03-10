import jsPDF from "jspdf";
import ModelFields from "../../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../../utils/ModelEnums";
import Logo from "../../../../../../assets/hpt_logo.png"
import {IdealCurrents} from "../../../../LoadBankPage/Steps/LoadBankStepSteps/step_utils";
import FileUtils from "../../../../../../utils/file_utils";
// import XLSX from "xlsx";

const LOGO_ASPECT_RATIO = 1.26
const IMAGE_HEIGHT = 80
const DIVIDER_WIDTH = IMAGE_HEIGHT * LOGO_ASPECT_RATIO

const INLINE_IMAGE_EXTENSIONS = ["jpeg", "jpg", "gif", "png"]

export async function createCertificate (instrument, user, calibrationEvent, token) {
    let certificate = new jsPDF()
    const pageWidth = certificate.internal.pageSize.getWidth();
    await addImage(certificate, Logo, 'png')
    certificate.line((pageWidth - DIVIDER_WIDTH) / 2, IMAGE_HEIGHT, (pageWidth + DIVIDER_WIDTH) / 2, IMAGE_HEIGHT)
    writeInstrumentDetails(certificate, user, instrument, calibrationEvent, pageWidth)
    let additionalEvidence = calibrationEvent[ModelFields.CalibrationFields.AdditionalFile]
    let loadBankData = calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.LoadBankFile]) : undefined
    additionalEvidence ? writeAdditionalEvidence(certificate, additionalEvidence, instrument, token) : loadBankData ? writeLoadBankSection(certificate, loadBankData) : console.log()
    if (!additionalEvidence) saveCertificate(certificate, instrument)
}

let saveCertificate = (certificate, instrument) => {
    certificate.save(`calibration_certificate_inst_${instrument[Instrument.FIELDS.ASSET_TAG]}.pdf`)
}

export function addImage(certificate, image, extension, marginTop=0) {
    const pageWidth = certificate.internal.pageSize.getWidth();
    let imageHeight = IMAGE_HEIGHT
    let imageWidth = IMAGE_HEIGHT * LOGO_ASPECT_RATIO
    certificate.addImage(image, extension, (pageWidth - imageWidth) / 2, marginTop, imageWidth, imageHeight)
}

function convertImgToBase64URL(url, callback, mimetype){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(mimetype);
        callback(dataURL);
        canvas = null;
    };
    img.onerror = (error, error2, error3) => {
        let messag = ""
        alert(error2)
    }
    img.onabort = (error) => alert(error.target.value)
    img.src = url;
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

function writeAdditionalEvidence (certificate, additionalEvidence, instrument, token) {
    const extension = additionalEvidence.split(".").pop()
    const name = FileUtils.getFileNameFromPath(additionalEvidence)
    const pageWidth = certificate.internal.pageSize.getWidth();
    if (INLINE_IMAGE_EXTENSIONS.includes(extension)) {
        let addImageCallback = (image) => {
            certificate.text('ADDITIONAL EVIDENCE:', pageWidth / 2, 190, 'center');
            addImage(certificate, image, extension, 195)
            saveCertificate(certificate, instrument)
        }
        convertImgToBase64URL(additionalEvidence, addImageCallback, `image/${extension}`)
        //srcToFile(additionalEvidence, name, `image/png`, addImageCallback)
        // addImage(certificate, additionalEvidence)
    }
    // else if (extension == "xlsx") {
    //     let callBack = (file) => {
    //             var workbook = XLSX.read(file, {
    //                 type: 'array'
    //             });
    //             certificate.text('ADDITIONAL EVIDENCE:', pageWidth / 2, 190, 'center');
    //             workbook.SheetNames.forEach(function (sheetName) {
    //                 var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    //                 let table = {}
    //                 let body = []
    //                 XL_row_object.forEach((row) => {
    //                     let rowAsArray = Object.values(row)
    //                     if (Object.keys(table).length == 0) {
    //                         table['head'] = [Object.values(row)]
    //                     } else {
    //                         body.push(Object.values(row))
    //                     }
    //                 })
    //                 table['body'] = body
    //                 certificate.autoTable(table)
    //             })
    //             saveCertificate(certificate, instrument)
    //     }
    //     srcToFile(additionalEvidence, name, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, callBack)
    // }
    else {
        certificate.autoTable({
            head: [['AdditionalEvidence']],
            body: [[additionalEvidence]]
        })
        saveCertificate(certificate, instrument)
    }
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

function srcToFile(src, fileName, mimeType, callBack, token) {
    let init = {mode: 'cors',}
    return (fetch(src, init)
            .then(res => {
                return res.arrayBuffer()
            })
            // .then(buf =>
            // {return new Blob([buf], fileName, {type:mimeType});})
            .then(file => callBack(file))
            .catch(error => {
                alert(error)
            })
    );
}