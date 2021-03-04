import {URLS} from "../strings";
import RequestUtils from "./request_utils";
import ModelFields from "../../utils/enums";


export default class CalibrationRequests {

    static async recordCalibration(token, instrument, date, user, comment, file,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage) {

        let header = RequestUtils.buildTokenHeader(token)
        let fields = this.buildCreateCalibrationData(instrument,date,user,comment,file)
        RequestUtils.assistedFetch(URLS.CALIBRATIONS, "post",
            callBack, errorMessageCallBack,
            header, undefined, fields)
    }

    static buildCreateCalibrationData(instrument,date,user,comment,file) {
        let fields = {}
        fields[ModelFields.CalibrationFields.Instrument] = instrument
        fields[ModelFields.CalibrationFields.Date] = date
        fields[ModelFields.CalibrationFields.User] = user
        fields[ModelFields.CalibrationFields.Comment] = comment
        fields[ModelFields.CalibrationFields.File] = file

        return RequestUtils.removeEmptyFields(fields)
    }
}