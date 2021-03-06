import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";
import {EquipmentModel, Instrument} from "../../utils/ModelEnums";

export default class MiscellaneousRequests {

    static async getVendors(token,
                            modelNumberSubstring,
                            callBack = (json) => json,
                            errorMessageCallBack = (errorMessage) => errorMessage) {
        let params = {model_number: modelNumberSubstring}
        RequestUtils.removeEmptyFields(params)
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.VENDOR,
            METHODS.GET, callBack, errorMessageCallBack, header, params)
    }

    static async getModelNumbers(token,
                                 vendorSubstring = undefined,
                                 callBack = (json) => json,
                                 errorMessageCallBack = (errorMessage) => errorMessage) {
        let params = {vendor: vendorSubstring}
        RequestUtils.removeEmptyFields(params)
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.MODEL_NUMBERS,
            METHODS.GET, callBack, errorMessageCallBack, header, params)
    }

    /*
     if the instrument table makes the call, get categories for both instruments and models and make a callback
     tying the category type (model_categories or instrument_categories) to the result

     If model table makes call, just get model categories
     */


    static async getCategories(token,
                               modelType,
                               callBack = (json) => json,
                               errorMessageCallBack = (errorMessage) => errorMessage,
                               onlyOneType = false) {
        let header = RequestUtils.buildTokenHeader(token)
        if (!onlyOneType || modelType === EquipmentModel.TYPE) {
            RequestUtils.assistedFetch(URLS.MODEL_CATEGORIES,
                METHODS.GET, callBack(ModelFields.EquipmentModelFields.MODEL_CATEGORIES), errorMessageCallBack, header)
        }
        if (modelType === Instrument.TYPE) {
            RequestUtils.assistedFetch(URLS.INSTRUMENT_CATEGORIES,
                METHODS.GET, callBack(ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES), errorMessageCallBack, header)
        }
    }

    static async getCalibratedWithOptions(token,
                                          callback = (json) => json,
                                          errorMessageCallBack = (errorMessage) => errorMessage,
                                          instrumentId) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.CALIBRATORS(instrumentId), METHODS.GET, callback, errorMessageCallBack, header)
    }

    static async getPendingApproval(token,
                                    callback = (json) => json,
                                    errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.PENDING_APPROVAL, METHODS.GET, callback, errorMessageCallBack, header)
    }
}