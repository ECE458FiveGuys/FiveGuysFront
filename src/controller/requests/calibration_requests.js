import {METHODS, URLS} from "../strings";
import RequestUtils from "./request_utils";
import ModelFields from "../../utils/enums";


export default class CalibrationRequests {

    static async recordCalibration(token, instrumentId, date, userId, comment, file = undefined, loadBankData = undefined,
                                   callBack = (json) => json,
                                   errorMessageCallBack = (errorMessage) => errorMessage,
                                   klufeData=undefined, calibratedWithPKs=undefined) {

        let header = RequestUtils.buildTokenHeader(token)
        let data = this.buildCreateCalibrationData(instrumentId, date, userId, comment, file, loadBankData, klufeData, calibratedWithPKs)
        RequestUtils.assistedFetch(URLS.CALIBRATIONS, "post",
            callBack, errorMessageCallBack,
            header, undefined, data)
    }

    static retreiveCalibrationEvent(token, eventId,
                                    callBack = (json) => json,
                                    errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.CALIBRATIONS + eventId, METHODS.GET, callBack, errorMessageCallBack, header)
    }

    static buildCreateCalibrationData(instrumentId, date, userId, comment, file, loadBankData, klufeData, calibratedWithPks) {
        const data = new FormData();
        data.append(ModelFields.CalibrationFields.Instrument, instrumentId)
        data.append(ModelFields.CalibrationFields.Date, date)
        data.append(ModelFields.CalibrationFields.User, userId)
        if (comment) data.append(ModelFields.CalibrationFields.Comment, comment)
        if (calibratedWithPks) {
            calibratedWithPks.forEach(pk => {
                data.append(ModelFields.CalibrationFields.CalibratedWith, parseInt(pk))
            })
        }
        if (loadBankData) {
            data.append(ModelFields.CalibrationFields.LoadBankFile, JSON.stringify(loadBankData))
        } else if (klufeData) {
            data.append(ModelFields.CalibrationFields.HardwareCalibrationFile, JSON.stringify(klufeData))
        } else if (file) {
            data.append(ModelFields.CalibrationFields.AdditionalFile, file)
        }
        return data
    }

    static handleCalibration(token, mode, eventPk, userId, comment, callBack, errorCallBack) {
        let formData = new FormData()
        if (userId) formData.append(ModelFields.ApprovalDataFields.APPROVER, userId)
        if (comment) formData.append(ModelFields.ApprovalDataFields.COMMENT, comment)
        if (eventPk) formData.append("calibration_event", eventPk)
        formData.append(ModelFields.ApprovalDataFields.IS_APPROVED, mode == "approved" ? "True" : "False")
        RequestUtils.assistedFetch(URLS.APPROVAL_DATA, METHODS.POST, callBack, errorCallBack, RequestUtils.buildTokenHeader(token), undefined, formData
            )
    }
}