import RequestUtils from "./request_utils";

import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";
import {METHODS, URLS} from "../strings";
import {EquipmentModel, Instrument} from "../../utils/ModelEnums";
import {PaginatedResponseFields} from "../../app/Common/Tables/TableUtils/pagination_utils";
import {User} from "../../utils/dtos";
import ModelRequests from "./model_requests";

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
            if (json[PaginatedResponseFields.RESULTS].length > 0) {
                throw new UserError("Instances using this category exist")
            } else {
                callBack()
            }
        }

        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.INSTRUMENTS,
            METHODS.GET, fullCallBack, errorMessageCallBack, header, params)
    }

    static async getInstrumentsWithSearchParams(token, searchParams,
                                                callBack = (json) => json,
                                                errorMessageCallBack = (errorMessage) => errorMessage,
                                                pageNum,
                                                ordering,
                                                exportMode,
                                                pageSize=undefined) {
        RequestUtils.getWithSearchParams(ModelFields.ModelTypes.INSTRUMENT, token, searchParams, callBack,
            errorMessageCallBack, pageNum, ordering, exportMode, pageSize)
    }

    static async getAllInstruments(token,
                                    callBack = (json) => json,
                                    errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.INSTRUMENTS_ALL, METHODS.GET, callBack, errorMessageCallBack, header)
    }

    static async getInstrumentsByPK(token,
                                   callBack = (json) => json,
                                   errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.INSTRUMENTS_ALL, METHODS.GET, callBack, errorMessageCallBack, header)
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

    static async createInstrument(token, model_number, vendor, serial_number, comment=undefined,
                                  asset_tag_number, instrument_categories,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage) {

        InstrumentRequests.updateInstrument(token, "post", URLS.INSTRUMENTS, callBack, errorMessageCallBack,
            model_number, vendor, serial_number, comment, asset_tag_number, instrument_categories)
    }

    static async createInstrumentWithFields(token, fields,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage) {

        InstrumentRequests.updateInstrument(token, "post", URLS.INSTRUMENTS, callBack, errorMessageCallBack,
            fields.model_number, fields.vendor, fields.serial_number,
            fields.comment, fields[Instrument.FIELDS.ASSET_TAG], fields.instrument_categories)
    }

    static async editInstrument(token, instrument_pk, model_number=undefined,
                                vendor=undefined,
                                serial_number=undefined,
                                comment=undefined,
                                   asset_tag = undefined,
                                   instrument_categories = undefined,
                                   callBack = (json) => json,
                                   errorMessageCallBack = (errorMessage) => errorMessage) {

        InstrumentRequests.updateInstrument(token, "put", URLS.INSTRUMENTS + instrument_pk + "/",
            callBack, errorMessageCallBack, model_number, vendor, serial_number, comment, asset_tag, instrument_categories)
    }

    static async editInstrumentWithFields(token, instrument_pk, fields,
                                callBack = (json) => json,
                                errorMessageCallBack = (errorMessage) => errorMessage) {

        InstrumentRequests.updateInstrument(token, "put", URLS.INSTRUMENTS + instrument_pk + "/",
            callBack, errorMessageCallBack, fields.model_number, fields.vendor, fields.serial_number,
            fields.comment, fields[Instrument.FIELDS.ASSET_TAG], fields.instrument_categories, true)
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
                                  model_number=undefined, vendor=undefined, serial_number=undefined, comment=undefined,
                                  asset_tag = undefined, instrument_categories = undefined, editMode = undefined) {

        if (!vendor || !model_number) {
            errorMessageCallBack("Vendor and model number are required fields")
            return
        }

        let getModelCallBack = (json) => {
            let results = json[PaginatedResponseFields.RESULTS]
            if (results.length == 0) {
                throw new UserError("No models with this vendor and model number exist")
            }
            let model_pk = results[0].pk
            let header = RequestUtils.buildTokenHeader(token)
            let fields = RequestUtils.buildCreateInstrumentData(model_pk, serial_number, comment, asset_tag, instrument_categories, editMode)
            RequestUtils.assistedFetch(full_url, method,
                callBack, errorMessageCallBack,
                header, undefined, fields)
        }

        ModelRequests.getModels(token,
            {vendor : vendor, model_number : model_number}, getModelCallBack, errorMessageCallBack)

    }
}