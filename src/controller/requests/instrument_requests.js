import RequestUtils from "./request_utils";

import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";
import {METHODS, URLS} from "../strings";
import {EquipmentModel, Instrument} from "../../utils/ModelEnums";

export default class InstrumentRequests {

    static async getInstruments(token, callBack = (json) => json,
                                errorMessageCallBack = (errorMessage) => errorMessage,
                                page_num = undefined, asset_tag=undefined, vendor = undefined, model_number = undefined,
                                description = undefined, serial_number = undefined, search = undefined, search_field = undefined,
                                ordering = undefined) {

        let params = RequestUtils.buildGetInstrumentParams(page_num, vendor, model_number,
            description, serial_number, search, search_field, ordering, asset_tag)

        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(URLS.INSTRUMENTS,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header,
            params)
    }

    static async getInstrumentsByCategory(token, categoryObj,
                                     callBack,
                                     errorMessageCallBack) {
        let params = {}
        params[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES + "__name"] = categoryObj.name

        let fullCallBack = (json) => {
            if (json.length > 0) {
                throw new UserError("Instances using this category exist")
            } else {
                callBack()
            }
        }

        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.INSTRUMENTS,
            METHODS.GET, fullCallBack, errorMessageCallBack, header, params)
    }

    static async getInstrumentsWithSearchParams(token, params,
                                                callBack = (json) => json,
                                                errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        params = RequestUtils.removeEmptyFields(params)
        let url = URLS.INSTRUMENTS + RequestUtils.applySearchParams(params, Instrument.TYPE)
        RequestUtils.assistedFetch(url,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header,
            {},
            undefined)
    }

    static async retrieveInstrument(token, pk,
                                    callBack = (json) => json,
                                    errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(URLS.INSTRUMENTS+pk,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header)
    }

    static async createInstrument(token, model_pk, serial_number, comment=undefined,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage) {

        InstrumentRequests.updateInstrument(token, "post", URLS.MODELS, callBack, errorMessageCallBack, model_pk, serial_number, comment)
    }

    static async editInstrument(token, instrument_pk, model_pk=undefined, serial_number=undefined, comment=undefined,
                                   callBack = (json) => json,
                                   errorMessageCallBack = (errorMessage) => errorMessage) {

        InstrumentRequests.updateInstrument(token, "put", URLS.MODELS + instrument_pk,
            callBack, errorMessageCallBack, model_pk, serial_number, comment)
    }

    static async deleteInstruments(token, instrument_pk,
                                     callBack = (json) => json,
                                     errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.INSTRUMENTS + instrument_pk, "delete", callBack, errorMessageCallBack, header)
    }

    // private helpers

    static async updateInstrument(token, method, full_url,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage,
                                  model_pk=undefined, serial_number=undefined, comment=undefined) {
        let header = RequestUtils.buildTokenHeader(token)
        let fields = RequestUtils.buildCreateInstrumentData(model_pk, serial_number, comment)
        RequestUtils.assistedFetch(full_url, method,
                                    callBack, errorMessageCallBack,
                                    header, undefined, fields)
    }
}