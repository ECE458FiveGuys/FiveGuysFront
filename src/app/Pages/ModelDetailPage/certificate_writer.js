import jsPDF from "jspdf";
import ModelFields from "../../../utils/enums";
import {Instrument} from "../../../utils/ModelEnums";
import Image from "../../../assets/hpt_logo.png"

const LOGO_ASPECT_RATIO = 1.26
const IMAGE_HEIGHT = 80
const DIVIDER_WIDTH = IMAGE_HEIGHT * LOGO_ASPECT_RATIO

export function createCertificate (instrument, user, calibrationEvent) {
    let certificate = new jsPDF()
    const pageWidth = certificate.internal.pageSize.getWidth();
    addImage(certificate, pageWidth)
    certificate.line((pageWidth - DIVIDER_WIDTH) / 2, IMAGE_HEIGHT, (pageWidth + DIVIDER_WIDTH) / 2, IMAGE_HEIGHT)
    writeInstrumentDetails(certificate, user, instrument, calibrationEvent, pageWidth)
    let additionalEvidence = calibrationEvent[ModelFields.CalibrationFields.AdditionalFile]
    let loadBankData = calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? JSON.parse(calibrationEvent[ModelFields.CalibrationFields.LoadBankFile]) : undefined
    additionalEvidence ? writeAdditionalEvidence(certificate, additionalEvidence) : loadBankData ? writeLoadBankSection(certificate, loadBankData) : console.log()
    certificate.save(`calibration_certificate_inst_${instrument[Instrument.FIELDS.ASSET_TAG]}.pdf`)
}

export function addImage(certificate, pageWidth) {
    let imageHeight = IMAGE_HEIGHT
    let imageWidth = IMAGE_HEIGHT * LOGO_ASPECT_RATIO
    certificate.addImage(Image, 'png', (pageWidth - imageWidth) / 2, 0, imageWidth, imageHeight)
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
                ['Engineer', user.username]]
    })
}

function writeAdditionalEvidence (certificate, additionalEvidence) {
    certificate.autoTable({
        head: [['AdditionalEvidence']],
        body: [[additionalEvidence]]
    })
}

export function writeLoadBankSection (certificate, loadBankData) {
    Object.values(loadBankData).forEach(table =>{
        certificate.autoTable(table)
    })
}