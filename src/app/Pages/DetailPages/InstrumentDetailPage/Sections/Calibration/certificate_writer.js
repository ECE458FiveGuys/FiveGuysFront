import jsPDF from "jspdf";
import ModelFields from "../../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../../utils/ModelEnums";
import Logo from "../../../../../../assets/hpt_logo.png"
import {IdealCurrents} from "../../../../LoadBankPage/Steps/LoadBankStepSteps/step_utils";
import FileUtils from "../../../../../../utils/file_utils";
import Tree from 'react-tree-graph';
import ReactDOMServer from "react-dom/server";
import React, {Component, PropTypes} from 'react';
// import XLSX from "xlsx";


import * as XLSX from 'xlsx';
import {
    VoltageTestErrorMargins,
    VoltageTestInputFrequencies,
    VoltageTestInputVoltages
} from "../../../../KlufeWizardPage/step_utils";
import html2canvas from "html2canvas";

const LOGO_ASPECT_RATIO = 1.26
const IMAGE_HEIGHT = 80 + 10
const DIVIDER_WIDTH = IMAGE_HEIGHT * LOGO_ASPECT_RATIO
const TOP_MARGIN = 15
const SUBHEADING_FONT_SIZE = 20

const INLINE_IMAGE_EXTENSIONS = ["jpeg", "jpg", "gif", "png"]

export async function createCertificate (instrument, user, calibrationEvent, token) {
    let certificate = new jsPDF()
    const pageWidth = certificate.internal.pageSize.getWidth();
    await addImage(certificate, Logo, 'png', 10)
    certificate.line((pageWidth - DIVIDER_WIDTH) / 2, IMAGE_HEIGHT + 10, (pageWidth + DIVIDER_WIDTH) / 2, IMAGE_HEIGHT + 10)
    writeInstrumentDetails(certificate, user, instrument, calibrationEvent, pageWidth)

    let additionalEvidence = calibrationEvent[ModelFields.CalibrationFields.AdditionalFile]
    let loadBankData = calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.LoadBankFile]) : undefined
    let flukeData = calibrationEvent[ModelFields.CalibrationFields.HardwareCalibrationFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.HardwareCalibrationFile]) : undefined
    additionalEvidence ? writeAdditionalEvidence(certificate, additionalEvidence, instrument, token) :
        loadBankData ? writeLoadBankSection(certificate, loadBankData) :
            flukeData ? writeHardwareCalibrationSection(certificate, flukeData) :
                void(0)
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

export function addTree(certificate, image, extension, marginTop=0) {
    const pageWidth = certificate.internal.pageSize.getWidth();
    certificate.addImage(image, extension, (pageWidth) / 2, marginTop)
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
    pdf.text('CALIBRATION CERTIFICATE', pageWidth / 2, IMAGE_HEIGHT + 25, 'center');
    pdf.autoTable({
        head: [['Calibration Info', '']],
        margin: { top: IMAGE_HEIGHT + 35 },
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
    // start new page
    certificate.addPage()
    if (INLINE_IMAGE_EXTENSIONS.includes(extension)) {
        let addImageCallback = (image) => {
            certificate.text('ADDITIONAL EVIDENCE:', pageWidth / 2, 205, 'center');
            addImage(certificate, image, extension, 210)
            saveCertificate(certificate, instrument)
        }
        convertImgToBase64URL(additionalEvidence, addImageCallback, `image/${extension}`)
        //srcToFile(additionalEvidence, name, `image/png`, addImageCallback)
        // addImage(certificate, additionalEvidence)
    }
    else if (extension == "xlsx") {
        let callBack = (file) => {
            // var csv_table = xlsxToTable(file)
            certificate.setFontSize(SUBHEADING_FONT_SIZE)
            certificate.text('XLSX DATA FROM \n'+name+':\n', pageWidth / 2, TOP_MARGIN, 'center');
                var workbook = XLSX.read(file, {
                    type: 'array'
                });
                // certificate.text('XLSX DATA FROM '+name+':', pageWidth / 2, 190, 'center');
                // workbook.SheetNames.forEach(function (sheetName) {
                    var sheetName = workbook.SheetNames[0];
                    var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    // var XL_csv_object = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                    let table = {}
                    // let head = []
                    let body = []
                    table['margin'] = { top: 25 }
                    var count = -1
                    // head = ['XSLX File Data']
                    XL_row_object.forEach((row) => {
                        if(row.__rowNum__ != count+1){
                            if(Object.keys(table).length != 0) {
                                table['body'] = body
                                certificate.autoTable(table)
                                body = []
                            }
                            table['head'] = [Object.values(row)]
                        } else {
                            body.push(Object.values(row))
                        // let rowAsArray = Object.values(row)
                        // if (Object.keys(table).length == 0) {
                        //     table['head'] = [Object.values(row)]
                        }
                        count = row.__rowNum__
                            // body.push(Object.values(row))
                            // while(rowAsArray.length > head.length){
                            //     head.push('')
                            // }

                    }
                    )
                    // let _head = []
                    // _head.push(head)
                    // table['head'] = _head
                    // table['body'] = body
                    // certificate.autoTable(table)
                // })
                saveCertificate(certificate, instrument)
        }
        srcToFile(additionalEvidence, name, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, callBack)
    }
    else if(extension == "pdf") {
        // let callBack = (file) => {
        //     // var csv_table = xlsxToTable(file)
        //     certificate.setFontSize(SUBHEADING_FONT_SIZE)
        //     certificate.text('XLSX DATA FROM \n'+name+':\n', pageWidth / 2, TOP_MARGIN, 'center');
    }
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

export function writeHardwareCalibrationSection(certificate, flukeData) {
    buildFlukeVoltageTestTable(certificate, flukeData.DCreadings, "DC")
    buildFlukeVoltageTestTable(certificate, flukeData.ACreadings, "AC")
}

function buildFlukeVoltageTestTable(certificate, readings, type) {
    certificate.autoTable(
        {
            head: [[`${type} Test Inputs (Klufe K5700)`,
                'Corresponding Voltage (Fluke 87)',
                'Accepted Error Margin',
                'ok?'
            ]],
            columnStyles: {3: {fillColor: [0, 250, 0]}},
            body: Object.keys(readings).map(testVoltageStepKey => {
                let recordedVoltage = readings[testVoltageStepKey]
                return [VoltageTestInputVoltages[testVoltageStepKey].toString() + " V" + (type == "AC" ? " @ " + VoltageTestInputFrequencies[testVoltageStepKey] : ""),
                    recordedVoltage + " V",
                    "\u00B1" + VoltageTestErrorMargins[testVoltageStepKey].toString() + " V",
                    'ok']
            })
        })
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

function xlsxToTable(file) {
    var name = file.name;
    const reader = new FileReader();
    // reader.onload = (evt) => { // evt = on_file_select event
        /* Parse data */
    // const bstr = evt.target.result;
    const wb = XLSX.read(file, {type:'array'});
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_csv(ws, {header:1});
    /* Update state */
    console.log("Data>>>"+data);
    return data
    // };
    // reader.readAsBinaryString(file);
}

function tree_generator(instrument_tree){
    return(
        <div>
            <Tree
                data={instrument_tree}
                height={500}
                width={500}
                />
        </div>
    )
}

