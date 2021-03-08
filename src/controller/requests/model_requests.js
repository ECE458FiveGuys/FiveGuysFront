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

    static async createModelWithFields(token, fields,
                              callBack = (json) => json,
                              errorMessageCallBack = (errorMessage) => errorMessage
                                ) {
        ModelRequests.updateModel(token, URLS.MODELS, METHODS.POST,
            callBack, errorMessageCallBack, fields)
    }

    static async editModelWithFields(token, modelId, fields,
                                       callBack = (json) => json,
                                       errorMessageCallBack = (errorMessage) => errorMessage
    ) {
        ModelRequests.updateModel(token, URLS.MODELS + modelId + "/", METHODS.PUT,
            callBack, errorMessageCallBack, fields)
    }

    // static async editModel(token, model_pk, vendor = undefined, model_number = undefined, description = undefined, comment = undefined,
    //                         calibration_frequency = undefined,
    //                        callBack = (json) => json,
    //                        errorMessageCallBack = (errorMessage) => errorMessage) {
    //
    //     ModelRequests.updateModel(token, "put", URLS.MODELS + model_pk + "/",
    //                                             callBack,
    //                                             errorMessageCallBack,
    //                                             vendor, model_number, description, comment, calibration_frequency)
    // }

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

    static async updateModel(token, url, method,
                             callBack = (json) => json,
                             errorMessageCallBack = (errorMessage) => errorMessage,
                             fields) {
        let header = RequestUtils.buildTokenHeader(token)
        if (!fields.calibration_frequency || fields.calibration_frequency == 0) fields.calibration_mode = ModelFields.CalibrationModes.NOT_CALIBRATABLE
        let data = new FormData()
        data.append(ModelFields.EquipmentModelFields.MODEL_NUMBER, fields[ModelFields.EquipmentModelFields.MODEL_NUMBER])
        data.append(ModelFields.EquipmentModelFields.VENDOR, fields[ModelFields.EquipmentModelFields.VENDOR])
        data.append(ModelFields.EquipmentModelFields.DESCRIPTION, fields[ModelFields.EquipmentModelFields.DESCRIPTION])
        if (fields[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY]) data.append(ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY, parseInt(fields[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY]))
        if (fields[ModelFields.EquipmentModelFields.COMMENT]) data.append(ModelFields.EquipmentModelFields.COMMENT, fields[ModelFields.EquipmentModelFields.COMMENT])
        if (fields[ModelFields.EquipmentModelFields.CALIBRATION_MODE]) data.append(ModelFields.EquipmentModelFields.CALIBRATION_MODE, fields[ModelFields.EquipmentModelFields.CALIBRATION_MODE])
        let modelCategories = fields[ModelFields.EquipmentModelFields.MODEL_CATEGORIES]
        if (modelCategories) {
            modelCategories.forEach(category => {
                data.append(ModelFields.EquipmentModelFields.MODEL_CATEGORIES, category.name ? category.name : category)
            })
        }
        RequestUtils.assistedFetch(url, method,
                                    callBack, errorMessageCallBack,
                                    header, undefined, data)
    }
}