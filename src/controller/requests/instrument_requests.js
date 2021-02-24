import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";

export default class InstrumentRequests {

    static async get_instruments(token, page_num = undefined, vendor = undefined, model_number = undefined,
                            description = undefined, serial_number = undefined, search = undefined, search_field = undefined,
                            ordering = undefined) {

        let params = RequestUtils.build_get_instrument_params(page_num, vendor, model_number,
            description, serial_number, search, search_field, ordering)

        let header = RequestUtils.build_token_header(token)

        let instrument_data = await RequestUtils.assisted_fetch(URLS.INSTRUMENTS,
            METHODS.GET,
            header,
            params)
        return instrument_data
    }

    static async get_instruments_with_search_params(token, params) {
        let header = RequestUtils.build_token_header(token)
        params = RequestUtils.remove_empty_fields(params)
        let instrument_data = await RequestUtils.assisted_fetch(URLS.INSTRUMENTS,
            METHODS.GET,
            header,
            params,
            undefined, true)
        return instrument_data
    }

    static async retrieve_instrument(token, pk) {
        let header = RequestUtils.build_token_header(token)

        return await RequestUtils.assisted_fetch(URLS.INSTRUMENTS+pk,
            METHODS.GET,
            header)
    }

    static async create_instrument(token, model_pk, serial_number, comment=undefined) {

        return await InstrumentRequests.update_instrument(token, "post", URLS.MODELS, model_pk, serial_number, comment)
    }

    static async edit_model(token, instrument_pk, model_pk=undefined, serial_number=undefined, comment=undefined) {

        return await InstrumentRequests.update_model(token, "put", URLS.MODELS + RequestUtils.apply_request_param_suffix({"pk" : instrument_pk}),
            model_pk, serial_number, comment)
    }

    static async delete_model(token, model_pk) {
        let header = RequestUtils.build_token_header(token)
        return await RequestUtils.assisted_fetch(URLS.MODELS, "delete", header, {"pk": model_pk})
    }

    // private helpers

    static async update_instrument(token, method, full_url, model_pk=undefined, serial_number=undefined, comment=undefined) {
        let header = RequestUtils.build_token_header(token)
        let fields = RequestUtils.build_create_instrument_data(model_pk, serial_number, comment)
        return await RequestUtils.assisted_fetch(full_url, method, header, undefined, fields)
    }
}