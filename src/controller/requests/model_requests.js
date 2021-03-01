import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";
import {EquipmentModel} from "../../utils/ModelEnums";

export default class ModelRequests {

    static async getModels(token, page_num = undefined, vendor = undefined, model_number = undefined,
                            description = undefined, search = undefined, search_field = undefined,
                            ordering = undefined,
                            callBack = (json) => json,
                            errorMessageCallBack = (errorMessage) => errorMessage) {
        let params = RequestUtils.buildGetModelParams(page_num, vendor, model_number,
            description, search, search_field, ordering)

        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(URLS.MODELS,
            METHODS.GET, callBack, errorMessageCallBack, header, params)
    }

    static async getModelsByCategory(token, categoryObj,
                                       callBack,
                                       errorMessageCallBack) {
        let params = {}
        params[ModelFields.EquipmentModelFields.MODEL_CATEGORIES + "__name"] = categoryObj.name

        let fullCallBack = (json) => {
            if (json.length > 0) {
                throw new UserError("Instances using this category exist")
            } else {
                callBack()
            }
        }

        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.MODELS,
            METHODS.GET, fullCallBack, errorMessageCallBack, header, params)
    }

    static async getModelsWithSearchParams(token, params,
                                           callBack = (json) => json,
                                           errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        params = RequestUtils.removeEmptyFields(params)
        let url = URLS.MODELS + RequestUtils.applySearchParams(params, EquipmentModel.TYPE)
        RequestUtils.assistedFetch(url,
            METHODS.GET, callBack, errorMessageCallBack, header, {}, undefined)
    }

    static async retrieveModel(token,
                               pk,
                               callBack = (json) => json,
                               errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(URLS.MODELS + pk,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header)
    }

    static async create_model(token, vendor, model_number, description,
                              comment = undefined, calibration_frequency = undefined,
                              callBack = (json) => json,
                              errorMessageCallBack = (errorMessage) => errorMessage
                                ) {

        ModelRequests.updateModel(token, "post", URLS.MODELS,
            callBack,
            errorMessageCallBack,
            vendor, model_number, description, comment, calibration_frequency)
    }

    static async editModel(token, model_pk, vendor = undefined, model_number = undefined, description = undefined, comment = undefined,
                            calibration_frequency = undefined,
                           callBack = (json) => json,
                           errorMessageCallBack = (errorMessage) => errorMessage) {

        ModelRequests.updateModel(token, "put", URLS.MODELS + model_pk + "/",
                                                callBack,
                                                errorMessageCallBack,
                                                vendor, model_number, description, comment, calibration_frequency)
    }

    static async deleteModel(token, model_pk,
                             callBack = (json) => json,
                             errorMessageCallBack = (errorMessage) => errorMessage) {
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.MODELS + model_pk, "delete",
                                    callBack,
                                    errorMessageCallBack,
                                    header)
    }

    // private helpers

    static async updateModel(token, method, url,
                             callBack = (json) => json,
                             errorMessageCallBack = (errorMessage) => errorMessage,
                             vendor = undefined, model_number = undefined,
                              description = undefined, comment = undefined, calibration_frequency = undefined) {
        let header = RequestUtils.buildTokenHeader(token)
        let fields = {}
        fields[ModelFields.EquipmentModelFields.VENDOR] = vendor
        fields[ModelFields.EquipmentModelFields.MODEL_NUMBER] = model_number
        fields[ModelFields.EquipmentModelFields.DESCRIPTION] = description
        fields[ModelFields.EquipmentModelFields.COMMENT] = comment
        fields[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] = calibration_frequency
        RequestUtils.removeEmptyFields(fields)
        RequestUtils.assistedFetch(url, method,
                                    callBack, errorMessageCallBack,
                                    header, undefined, fields)
    }
}