import {URLS} from "../strings";
import RequestUtils from "./request_utils";
import ModelFields from "../../utils/enums";


export default class CalibrationRequests {

    static async recordCalibration(token, instrumentId, date, userId, comment, file = undefined, loadBankData = undefined,
                                   callBack = (json) => json,
                                   errorMessageCallBack = (errorMessage) => errorMessage) {

        let header = RequestUtils.buildTokenHeader(token)
        let data = this.buildCreateCalibrationData(instrumentId, date, userId, comment, file, loadBankData)
        RequestUtils.assistedFetch(URLS.CALIBRATIONS, "post",
            callBack, errorMessageCallBack,
            header, undefined, data)
    }

    static buildCreateCalibrationData(instrumentId, date, userId, comment, file, loadBankData) {
        const data = new FormData();
        data.append(ModelFields.CalibrationFields.Instrument, instrumentId)
        data.append(ModelFields.CalibrationFields.Date, date)
        data.append(ModelFields.CalibrationFields.User, userId)
        if (comment) {
            data.append(ModelFields.CalibrationFields.Comment, comment)
        }
        if (loadBankData) {
            data.append(ModelFields.CalibrationFields.LoadBankFile, JSON.stringify(loadBankData))
        } else if (file) {
            data.append(ModelFields.CalibrationFields.AdditionalFile, file)
        }
        return data
    }
}