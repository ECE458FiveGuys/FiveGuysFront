import ModelFields from "../../utils/enums";
import {METHODS, URLS} from "../../strings";
import ServerError from "../exceptions"

export const ParamNames = {
    SEARCH : "search",
    SEARCH_FIELD : "search_field",
    ORDERING : "ordering",
    ID : "pk",
    PAGE_NUMBER : "page"
}

export default class RequestUtils {

    static async assisted_fetch(url, method, header, params=undefined, data=undefined) {
        return fetch(url+RequestUtils.apply_request_param_suffix(params), {
            method: method,
            headers: header,
            data : data
        })
            .then(data => {
                data.json()
            })
            .catch(e => throw ServerError())
    }


    static build_token_header(token) {
        return {
            'Authorization': token
        }
    }

    static apply_request_param_suffix(param_obj) {
        let suffix = "?"
        Object.keys(param_obj).forEach(key => {
            suffix+=key+"="+param_obj[key]+"&"
        })
        return suffix.slice(0, -1) // removes last &
    }

    static remove_empty_fields(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj
    }

    static build_get_model_params(page_num = undefined, vendor = undefined, model_number = undefined,
                                  description = undefined, search = undefined, search_field = undefined,
                                  ordering = undefined) {
        let params = []
        params[ParamNames.PAGE_NUMBER] = page_num
        params[ParamNames.ORDERING] = ordering
        params[ParamNames.SEARCH] = search
        params[ParamNames.SEARCH_FIELD] = search_field
        params[ModelFields.EquipmentModelSearchFields.Vendor] = vendor
        params[ModelFields.EquipmentModelSearchFields.Description] = description
        params[ModelFields.EquipmentModelSearchFields["Model Number"]] = model_number
        return params
    }

    static build_get_instrument_params(page_num = undefined, vendor = undefined,
                                       model_number = undefined, description = undefined,
                                       serial_number = undefined, search = undefined,
                                       search_field = undefined, ordering = undefined) {
        let params = RequestUtils.build_get_model_params(page_num = page_num, vendor = vendor,
            model_number = model_number, description = description, search = search,
            search_field = search_field, ordering = ordering)
        params[ModelFields.InstrumentSearchFields["Serial Number"]] = serial_number
        return params
    }

    static build_create_instrument_data(model_pk, serial_number, comment) {
        let fields = {}
        fields[ModelFields.InstrumentFields.MODEL] = model_pk
        fields[ModelFields.InstrumentFields.SERIAL_NUMBER] = serial_number
        fields[ModelFields.InstrumentFields.COMMENT] = comment
        return RequestUtils.remove_empty_fields(fields)
    }

    static parse_error_message(object, message = "") {
        Object.keys(object).forEach(k => {
            if (object[k] && typeof object[k] === 'string') {
                return message += (object[k]) + "\n\n";
            }
            if (object[k] && typeof object[k] === 'object') {
                return RequestUtils.parse_error_message(object[k], message);
            }
        });
    }

}