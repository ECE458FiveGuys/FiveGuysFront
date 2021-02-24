import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";

export default class ModelRequests {

    static async get_models(token, page_num = undefined, vendor = undefined, model_number = undefined,
                            description = undefined, search = undefined, search_field = undefined,
                            ordering = undefined) {
        let params = RequestUtils.build_get_model_params(page_num, vendor, model_number,
            description, search, search_field, ordering)

        let header = RequestUtils.build_token_header(token)

        let model_data = await RequestUtils.assisted_fetch(URLS.MODELS,
            METHODS.GET, header, params)
        return model_data
    }

    static async get_models_with_search_params(token, params) {
        let header = RequestUtils.build_token_header(token)
        params = RequestUtils.remove_empty_fields(params)
        let model_data = await RequestUtils.assisted_fetch(URLS.MODELS,
            METHODS.GET, header, params, undefined, true)
        return model_data
    }

    static async retrieve_model(token, pk) {
        let header = RequestUtils.build_token_header(token)

        return await RequestUtils.assisted_fetch(URLS.MODELS+pk,
            METHODS.GET,
            header)
    }

    static async create_model(token, vendor, model_number, description,
                              comment = undefined, calibration_frequency = undefined) {

        return await ModelRequests.update_model(token, "post", URLS.MODELS, vendor, model_number, description, comment, calibration_frequency)
    }

    static async edit_model(token, model_pk, vendor = undefined, model_number = undefined, description = undefined, comment = undefined,
               calibration_frequency = undefined) {

        return await ModelRequests.update_model(token, "put", URLS.MODELS + RequestUtils.apply_request_param_suffix({"pk" : model_pk}),
                vendor, model_number, description, comment, calibration_frequency)
    }

    static async delete_model(token, model_pk) {
        let header = RequestUtils.build_token_header(token)
        return await RequestUtils.assisted_fetch(URLS.MODELS, "delete", header, {"pk": model_pk})
    }

    // private helpers

    static async update_model(token, method, url, vendor = undefined, model_number = undefined,
                          description = undefined, comment = undefined, calibration_frequency = undefined) {
        let header = RequestUtils.build_token_header(token)
        let fields = {}
        fields[ModelFields.EquipmentModelFields.VENDOR] = vendor
        fields[ModelFields.EquipmentModelFields.MODEL_NUMBER] = model_number
        fields[ModelFields.EquipmentModelFields.DESCRIPTION] = description
        fields[ModelFields.EquipmentModelFields.COMMENT] = comment
        fields[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] = calibration_frequency
        RequestUtils.remove_empty_fields(fields)
        return await RequestUtils.assisted_fetch(url, method, header, undefined, fields)
    }
}