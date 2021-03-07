import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";
import {UserError} from "../exceptions";
import {EquipmentModel} from "../../utils/ModelEnums";
import {PaginatedResponseFields} from "../../app/Common/Tables/pagination_utils";

export default class ModelRequests {

    static async getModels(token,
                           params,
                           callBack = (json) => json,
                           errorMessageCallBack = (errorMessage) => errorMessage,
                           pageNum= undefined,
                           ordering = undefined) {

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
            if (json[PaginatedResponseFields.RESULTS].length > 0) {
                throw new UserError("Instances using this category exist")
            } else {
                callBack()
            }
        }

        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.MODELS,
            METHODS.GET, fullCallBack, errorMessageCallBack, header, params)
    }

    static async getModelsWithSearchParams(token,
                                           searchParams,
                                           callBack = (json) => json,
                                           errorMessageCallBack = (errorMessage) => errorMessage,
                                           pageNum= undefined,
                                           ordering = undefined) {
        RequestUtils.getWithSearchParams(ModelFields.ModelTypes.EQUIPMENT_MODEL, token, searchParams, callBack,
            errorMessageCallBack, pageNum, ordering)
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
        RequestUtils.assistedFetch(url, method,
                                    callBack, errorMessageCallBack,
                                    header, undefined, fields)
    }
}