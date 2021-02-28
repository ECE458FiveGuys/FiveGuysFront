import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";

export default class CategoryRequests {

    static async createModelCategory(token,
                                      callBack = (json) => json,
                                      errorMessageCallBack = (errorMessage) => errorMessage,
                                      fieldMap
                                    ) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = {}
        data[ModelFields.CategoryFields.NAME] = fieldMap[ModelFields.CategoryFields.NAME]
        RequestUtils.assistedFetch(URLS.MODEL_CATEGORIES,
            METHODS.POST, callBack, errorMessageCallBack, header, undefined, data)
    }

    static async createInstrumentCategory(token,
                                     callBack = (json) => json,
                                     errorMessageCallBack = (errorMessage) => errorMessage,
                                     fieldMap
    ) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = {}
        data[ModelFields.CategoryFields.NAME] = fieldMap[ModelFields.CategoryFields.NAME]
        RequestUtils.assistedFetch(URLS.INSTRUMENT_CATEGORIES,
            METHODS.POST, callBack, errorMessageCallBack, header, undefined, data)
    }


    static async editModelCategory(token,
                                     pk,
                                     callBack = (json) => json,
                                     errorMessageCallBack = (errorMessage) => errorMessage,
                                     fieldMap
    ) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = {}
        data[ModelFields.CategoryFields.NAME] = fieldMap[ModelFields.CategoryFields.NAME]
        RequestUtils.assistedFetch(URLS.MODEL_CATEGORIES + pk + "/",
            METHODS.PUT, callBack, errorMessageCallBack, header, undefined, data)
    }

    static async editInstrumentCategory(token,
                                          pk,
                                          callBack = (json) => json,
                                          errorMessageCallBack = (errorMessage) => errorMessage,
                                          fieldMap
    ) {
        let header = RequestUtils.buildTokenHeader(token)
        let data = {}
        data[ModelFields.CategoryFields.NAME] = fieldMap[ModelFields.CategoryFields.NAME]
        RequestUtils.assistedFetch(URLS.INSTRUMENT_CATEGORIES + pk + "/",
            METHODS.PUT, callBack, errorMessageCallBack, header, undefined, data)
    }


    static async deleteModelCategory(token,
                                   pk,
                                   callBack = (json) => json,
                                   errorMessageCallBack = (errorMessage) => errorMessage
    ) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.MODEL_CATEGORIES + pk + "/",
            METHODS.DELETE, callBack, errorMessageCallBack, header)
    }

    static async deleteInstrumentCategory(token,
                                        pk,
                                        callBack = (json) => json,
                                        errorMessageCallBack = (errorMessage) => errorMessage
    ) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.INSTRUMENT_CATEGORIES + pk + "/",
            METHODS.DELETE, callBack, errorMessageCallBack, header)
    }
}