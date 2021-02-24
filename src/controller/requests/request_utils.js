import ModelFields from "../../utils/enums";
import {METHODS, URLS} from "../strings";
import {ServerError, UserError} from "../exceptions"

export const ParamNames = {
    SEARCH : "search",
    SEARCH_FIELD : "search_field",
    ORDERING : "ordering",
    ID : "pk",
    PAGE_NUMBER : "page"
}

export default class RequestUtils {

    static async assisted_fetch(url, method, header={}, params=undefined, data= undefined, all_search_fields=false){
        header['Content-Type'] = 'application/json';
        header['Accept'] = 'application/json';
        let init = {
            method: method,
            headers: header,
        }
        if (data) {
            init.body =  JSON.stringify(data)
        }
        let response = await fetch(url + RequestUtils.apply_request_param_suffix(params, all_search_fields), init)
        if (response.ok) {
            return await response.json()
        } else if (response.status >= 500 && response.status <600) {
            alert(new ServerError().message)
        } else {
            let json = await response.json()
            throw new UserError(RequestUtils.parse_error_message(json))
        }
    }

    static build_token_header(token) {
        return {
            'Authorization': 'Token ' + token
        }
    }


    // boolean determines whether all the parameters are search fields intended for a partial search
    static apply_request_param_suffix(param_obj, all_search_fields = false) {
        if (!param_obj || param_obj.size == 0) {
            return ""
        }
        let suffix = "?"
        Object.keys(param_obj).forEach(key => {
            if (all_search_fields) {
                suffix+=ParamNames.SEARCH+"="+param_obj[key]+"&"
                suffix+=ParamNames.SEARCH_FIELD+"="+key+"&"
            } else {
                suffix+=key+"="+param_obj[key]+"&"
            }
        })
        return suffix.slice(0, -1) // removes last &
    }

    static remove_empty_fields(obj) {
        for (var propName in obj) {
            if (!obj[propName] || obj[propName] == "") {
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
        params = RequestUtils.remove_empty_fields(params)
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

   static parse_error_message(object) {
        let message_set = new Set()
        this.deep_search_object_for_error_messages(object, message_set)
        let message = ""
        message_set.forEach(mess => message+=mess+"\n\n")
        return message
    }

    static deep_search_object_for_error_messages(object, message_set) {
        Object.keys(object).forEach(k => {
            if (object[k] && typeof object[k] === 'string') {
                message_set.add(object[k])
            }
            if (object[k] && typeof object[k] === 'object') {
                RequestUtils.deep_search_object_for_error_messages(object[k], message_set);
            }
        });
    }

}