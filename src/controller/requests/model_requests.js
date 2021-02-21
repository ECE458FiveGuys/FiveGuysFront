import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../../strings";
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
        return model_data["results"]
    }

    static async retrieve_model(host, token, pk) {
        let header = RequestUtils.build_token_header(token)

        return await RequestUtils.assisted_fetch(URLS.MODELS,
            METHODS.GET,
            header,
            {"pk": pk})
    }

    static async create_model(host, token, vendor, model_number, description,
                              comment = undefined, calibration_frequency = undefined) {

        return ModelRequests.update_model(token, "post", URLS.MODELS, vendor, model_number, description, comment, calibration_frequency)
    }

    static async edit_model(host, token, model_pk, vendor = undefined, model_number = undefined, description = undefined, comment = undefined,
               calibration_frequency = undefined) {

        return ModelRequests.update_model(token, "put", URLS.MODELS + RequestUtils.apply_request_param_suffix({"pk" : model_pk}),
                vendor, model_number, description, comment, calibration_frequency)
    }

    static async delete_model(host, token, model_pk) {
        let header = RequestUtils.build_token_header(token)
        let model_data = RequestUtils.assisted_fetch(URLS.MODELS, "delete", header, {"pk": model_pk})
        if ("pk" in model_data) {
            return model_data
        } else {
            throw UserError(RequestUtils.parse_error_message(model_data))
        }
    }

    // private helpers

    static update_model(token, method, url, vendor = undefined, model_number = undefined,
                          description = undefined, comment = undefined, calibration_frequency = undefined) {
        let header = RequestUtils.build_token_header(token)
        let fields = {}
        fields[ModelFields.EquipmentModelFields.VENDOR] = vendor
        fields[ModelFields.EquipmentModelFields.MODEL_NUMBER] = model_number
        fields[ModelFields.EquipmentModelFields.DESCRIPTION] = description
        fields[ModelFields.EquipmentModelFields.COMMENT] = comment
        fields[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] = calibration_frequency
        RequestUtils.remove_empty_fields(fields)
        let model_data = RequestUtils.assisted_fetch(url, method, header, undefined, fields)
        if ("pk" in model_data) {
            return model_data
        } else {
            throw UserError(RequestUtils.parse_error_message(model_data))
        }
    }
}