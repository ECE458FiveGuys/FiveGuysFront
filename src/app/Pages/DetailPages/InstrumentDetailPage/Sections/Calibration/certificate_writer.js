import jsPDF from "jspdf";
import ModelFields from "../../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../../utils/ModelEnums";
import Logo from "../../../../../../assets/hpt_logo.png"
import {IdealCurrents} from "../../../../LoadBankPage/Steps/LoadBankStepSteps/step_utils";
import FileUtils from "../../../../../../utils/file_utils";
import MiscellaneousRequests from "../../../../../../controller/requests/miscellaneous_requests";
// import XLSX from "xlsx";
import traverse from 'traverse'

import * as XLSX from 'xlsx';
import {
    VoltageTestErrorMargins,
    VoltageTestInputFrequencies,
    VoltageTestInputVoltages
} from "../../../../KlufeWizardPage/step_utils";
import {AUTH_URLS, METHODS, URLS} from "../../../../../../controller/strings";
import ErrorParser from "../../../../CreateFunctions/ErrorParser";
import RequestUtils from "../../../../../../controller/requests/request_utils";

const LOGO_ASPECT_RATIO = 1.26
const IMAGE_HEIGHT = 80 + 10
const DIVIDER_WIDTH = IMAGE_HEIGHT * LOGO_ASPECT_RATIO
const TOP_MARGIN = 15
const SUBHEADING_FONT_SIZE = 20

const INLINE_IMAGE_EXTENSIONS = ["jpeg", "jpg", "gif", "png"]

export async function createCertificate (instrument, user, calibrationEvent, token, isChainEnabled, newTab=false) {
    let certificate = new jsPDF()
    const pageWidth = certificate.internal.pageSize.getWidth();
    await addImage(certificate, Logo, 'png', 10)
    certificate.line((pageWidth - DIVIDER_WIDTH) / 2, IMAGE_HEIGHT + 10, (pageWidth + DIVIDER_WIDTH) / 2, IMAGE_HEIGHT + 10)
    certificate.setFont("helvetica")
    certificate.setFontSize(30)
    certificate.setTextColor(0, 100, 0);
    certificate.text('CALIBRATION CERTIFICATE', pageWidth / 2, IMAGE_HEIGHT + 25, 'center');
    //everything above here is only done once

    if (isChainEnabled){
        await getChainOfTruthTree(certificate, instrument, calibrationEvent, token, newTab)
    }
    else {
        writeInstrumentDetails(certificate, user, instrument, calibrationEvent, pageWidth)
        makePageWithoutChain(certificate, instrument, calibrationEvent, token)
        saveCertificate(certificate, instrument, newTab)
    }
}

let saveCertificate = (certificate, instrument, newTab) => {
    if (newTab) {
        certificate.output('dataurlnewwindow', 'calibration_data');
    } else {
        certificate.save(`calibration_certificate_inst_${instrument[Instrument.FIELDS.ASSET_TAG]}.pdf`)
    }
}

async function getChainOfTruthTree(certificate, instrument, calibrationEvent, token, newTab){
    let fullToken = 'Token ' + token
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': fullToken, 'Accept':'application/json'},
    };

    const response = await fetch(URLS.CALIBRATION_CERTIFICATE(instrument.pk), requestOptions)
        .then(response => {
            return response.text()})
        .then(json => { //success
            console.log(json)
            let realJson = JSON.parse(json)
            let json_tester = '{"pk":233,"instrument":{"pk":248,"serial_number":null,"asset_tag_number":100217,"model":{"pk":52,"model_number":"8508A","vendor":"Fluke","description":"8.5 Digit Reference Multimeter"}},"date":"2021-03-02","user":{"pk":1,"username":"admin"},"comment":"Emergency re-calibration","additional_evidence":null,"load_bank_data":"","guided_hardware_data":"","custom_data":"","approval_data":{"pk":206,"calibration_event":233,"approved":true,"approver":{"pk":1,"name":"Admin","username":"admin","email":"admin@localhost"},"date":"2021-04-07","comment":""},"calibrated_with":[{"pk":2,"serial_number":null,"asset_tag_number":884723,"calibration_event":{"pk":2,"instrument":{"pk":2,"serial_number":null,"asset_tag_number":884723,"model":{"pk":2,"model_number":"99V","vendor":"Fluke","description":"voltmeter"}},"date":"2021-03-01","user":{"pk":1,"username":"admin"},"comment":"Monthly load bank related instruments calibration - Mar21","additional_evidence":null,"load_bank_data":"","guided_hardware_data":"","custom_data":"","approval_data":{"pk":2,"calibration_event":2,"approved":true,"approver":{"pk":1,"name":"Admin","username":"admin","email":"admin@localhost"},"date":"2021-04-07","comment":""},"calibrated_with":[{"pk":128,"serial_number":null,"asset_tag_number":100114,"calibration_event":{"pk":123,"instrument":{"pk":128,"serial_number":null,"asset_tag_number":100114,"model":{"pk":28,"model_number":"8808A","vendor":"Fluke","description":"Digital Multimeter"}},"date":"2021-02-03","user":{"pk":1,"username":"admin"},"comment":"Calibrated all instruments markeds during January random tests on Feb 3rd","additional_evidence":null,"load_bank_data":"","guided_hardware_data":"","custom_data":"","approval_data":{"pk":96,"calibration_event":123,"approved":true,"approver":{"pk":1,"name":"Admin","username":"admin","email":"admin@localhost"},"date":"2021-04-07","comment":""},"calibrated_with":[],"calibration_expiration_date":"2021-04-18"}}],"calibration_expiration_date":"2021-04-30"}},{"pk":26,"serial_number":null,"asset_tag_number":100016,"calibration_event":{"pk":26,"instrument":{"pk":26,"serial_number":null,"asset_tag_number":100016,"model":{"pk":8,"model_number":"8558A","vendor":"Fluke","description":"Digit Multimeter"}},"date":"2021-02-03","user":{"pk":1,"username":"admin"},"comment":"Calibrated all instruments markeds during January random tests on Feb 3rd","additional_evidence":null,"load_bank_data":"","guided_hardware_data":"","custom_data":"","approval_data":{"pk":24,"calibration_event":26,"approved":true,"approver":{"pk":1,"name":"Admin","username":"admin","email":"admin@localhost"},"date":"2021-04-07","comment":""},"calibrated_with":[{"pk":250,"serial_number":null,"asset_tag_number":100219,"calibration_event":{"pk":235,"instrument":{"pk":250,"serial_number":null,"asset_tag_number":100219,"model":{"pk":52,"model_number":"8508A","vendor":"Fluke","description":"8.5 Digit Reference Multimeter"}},"date":"2021-01-01","user":{"pk":1,"username":"admin"},"comment":"Calibrated preemptively as a part of routine annual eval","additional_evidence":null,"load_bank_data":"","guided_hardware_data":"","custom_data":"","approval_data":{"pk":208,"calibration_event":235,"approved":true,"approver":{"pk":1,"name":"Admin","username":"admin","email":"admin@localhost"},"date":"2021-04-07","comment":""},"calibrated_with":[{"pk":326,"serial_number":null,"asset_tag_number":100083,"calibration_event":{"pk":312,"instrument":{"pk":326,"serial_number":null,"asset_tag_number":100083,"model":{"pk":22,"model_number":"AS0104","vendor":"AMETEK","description":"solid-state power amplifiers"}},"date":"2020-12-15","user":{"pk":1,"username":"admin"},"comment":"","additional_evidence":null,"load_bank_data":"","guided_hardware_data":"","custom_data":"","approval_data":{"pk":285,"calibration_event":312,"approved":true,"approver":{"pk":1,"name":"Admin","username":"admin","email":"admin@localhost"},"date":"2021-04-14","comment":""},"calibrated_with":[],"calibration_expiration_date":"2021-02-25"}}],"calibration_expiration_date":"2021-03-30"}}],"calibration_expiration_date":"2021-05-14"}}],"calibration_expiration_date":"2021-05-29"}'
            let testerFixed = JSON.parse(json_tester)
            json_tester = JSON.parse(json_tester)
            let map = {}
            let fakeCertificate = makeFakeCertificate()
            let tree = {}

            map = makePageRecursive(fakeCertificate, instrument, calibrationEvent, token, realJson, "", IMAGE_HEIGHT, map)
            tree = generateTree(realJson, tree, map);
            console.log(tree)
            tree_to_pdf(certificate, tree)
            map = makePageRecursive(certificate, instrument, calibrationEvent, token, realJson, "", IMAGE_HEIGHT, map)
            saveCertificate(certificate, instrument, newTab)
        })
        .catch((error) => {
            console.log(error)
        });



    //let header = RequestUtils.buildTokenHeader(token)
    //RequestUtils.assistedFetch(URLS.CALIBRATION_CERTIFICATE(instrument.pk), METHODS.GET, (json) => this.setState({calibratedWithOptions : json}), e => alert(e), header)
    //console.log(this.state.calibratedWithOptions)
}

function generateTree(json, tree, map){
    tree = {}
    let calibratedWith = json.calibrated_with
    tree["name"] = "Instrument " + json.instrument.asset_tag_number + " (Page: "+map[json.instrument.asset_tag_number]+")";
    let children = []
    if (calibratedWith) {
        calibratedWith.forEach(instrument => {
            children.push(generateTree(instrument.calibration_event, tree, map))
        })
    }
    tree["children"] = children;
    return tree;
}

function makeFakeCertificate(){
    let certificate = new jsPDF()
    const pageWidth = certificate.internal.pageSize.getWidth();
    certificate.line((pageWidth - DIVIDER_WIDTH) / 2, IMAGE_HEIGHT + 10, (pageWidth + DIVIDER_WIDTH) / 2, IMAGE_HEIGHT + 10)
    certificate.setFont("helvetica")
    certificate.setFontSize(30)
    certificate.setTextColor(0, 100, 0);
    certificate.text('CALIBRATION CERTIFICATE', pageWidth / 2, IMAGE_HEIGHT + 25, 'center');
    return certificate
}

function makePageRecursive(certificate, instrument, calibrationEvent, token, json, dateUsed, space, map) { //need to put who they callibrated?
    map[json.instrument.asset_tag_number] = certificate.internal.pages.length -1
    let calibratedWithString = ''
    let calibratedWith = json.calibrated_with
    let assetTagNumber = 0
    if (json.calibrated_with) {
        calibratedWith.forEach(temp => {
            assetTagNumber = temp.asset_tag_number
            calibratedWithString = calibratedWithString + assetTagNumber + " (Page " + map[assetTagNumber] + ")" + " "
        })
    }
    certificate.setFontSize(20)
    certificate.setTextColor(0, 100, 0);
    certificate.text('Instrument: '+json.instrument.asset_tag_number, 45, space + 32, 'center');
    certificate.autoTable({
        head: [['Instrument Info', '']],
        margin: { top: space + 35 },
        body: [['Model Number', json.instrument.model.model_number],
            ['Vendor', json.instrument.model.vendor],
            ['Short Description', json.instrument.model.description],
            ['Serial Number', json.instrument.serial_number],
            ['Asset Number', json.instrument.asset_tag_number]]
    })
    certificate.autoTable({
        head: [['Calibration Info', '']],
        margin: { top: space + 35 },
        body: [['Relevant Calibration Date', json.date],
            ['Use of Instrument Date', dateUsed],
            ['Calibration Expiration Date', json.calibration_expiration_date],
            ['Calibrated With', calibratedWithString]]
    })
    if (json.approval_data!=null) {
        certificate.autoTable({
            head: [['Calibration Approver Info', '']],
            margin: {top: space + 35},
            body: [['Name', json.approval_data.approver.name],
                [' Username', json.approval_data.approver.username],
                ['Email', json.approval_data.approver.email],
                ['Date', json.approval_data.date],
                ['Comment', json.approval_data.comment]]
        })
    }
    makePageWithoutChain(certificate, json.instrument, json, token)//here instrument.calibration_event or json
    certificate.addPage()
    calibratedWith = json.calibrated_with
    if (json.calibrated_with) {
        calibratedWith.forEach(instrument => {
            map = makePageRecursive(certificate, instrument, calibrationEvent, token, instrument.calibration_event, json.date, 0, map)
        })
    }
    return map
}

function makePageWithoutChain(certificate, instrument, calibrationEvent, token){
    let additionalEvidence = calibrationEvent[ModelFields.CalibrationFields.AdditionalFile]
    let loadBankData = calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.LoadBankFile]) : undefined
    let flukeData = calibrationEvent[ModelFields.CalibrationFields.HardwareCalibrationFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.HardwareCalibrationFile]) : undefined
    additionalEvidence ? writeAdditionalEvidence(certificate, additionalEvidence, instrument, token) :
        loadBankData ? writeLoadBankSection(certificate, loadBankData) :
            flukeData ? writeHardwareCalibrationSection(certificate, flukeData) :
                void(0)
    //if (!additionalEvidence) saveCertificate(certificate, instrument)
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
    pdf.autoTable({
        head: [['Instrument Info', '']],
        margin: { top: IMAGE_HEIGHT + 35 },
        body: [['Model Number', instrument.model.model_number],
            ['Vendor', instrument.model.vendor],
            ['Short Description', instrument.model.description],
            ['Serial Number', instrument.serial_number],
            ['Asset Number', instrument.asset_tag_number]]
    })
    pdf.autoTable({
        head: [['Calibration Info', '']],
        margin: { top: IMAGE_HEIGHT + 35 },
        body: [['Relevant Calibration Date', instrument.calibration_history[0].date],
            ['Calibration Expiration Date', instrument.calibration_expiration_date]]
    })
    if (instrument.calibration_history[0].approval_data!=null) {
        pdf.autoTable({
            head: [['Calibration Approver Info', '']],
            margin: {top: IMAGE_HEIGHT + 35},
            body: [['Name', instrument.calibration_history[0].approval_data.approver.name],
                [' Username', instrument.calibration_history[0].approval_data.approver.username],
                ['Email', instrument.calibration_history[0].approval_data.approver.email],
                ['Date', instrument.calibration_history[0].approval_data.date],
                ['Comment', instrument.calibration_history[0].approval_data.comment]]
        })
    }
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
            //saveCertificate(certificate, instrument)
        }
        convertImgToBase64URL(additionalEvidence, addImageCallback, `image/${extension}`)
        //srcToFile(additionalEvidence, name, `image/png`, addImageCallback)
        //addImage(certificate, additionalEvidence)
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
            //saveCertificate(certificate, instrument)
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
        //saveCertificate(certificate, instrument)
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

function tree_to_pdf(certificate, instrument_tree) {
    let res = ["\tCalibration Chain of Truth:\n\n"]
    certificate.addPage()
    certificate.setFontSize(10)
    const pageWidth = certificate.internal.pageSize.getWidth();
    const pageHeight = certificate.internal.pageSize.getHeight()
    res = traverse(instrument_tree).reduce(function (res, x) {
        if (x.toString().includes("[object Object]")) {
            return res
        }
        if (this.level === 0) {
            res = res + x.toString() + "\n\n"
        }
        if (x === undefined || this.key === undefined) {
            return res
        } else {
            res = res + "\t".repeat(this.level) + x.toString() + "\n\n"
        }
        return res
    }, res);
    certificate.text(res.toString(), pageWidth / 14, pageHeight / 12, 'left')
}