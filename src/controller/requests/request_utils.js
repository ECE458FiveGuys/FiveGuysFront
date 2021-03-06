import ModelFields from "../../utils/enums";
import {AUTH_URLS, HOSTS, METHODS, URLS} from "../strings";
import {ServerError, UserError} from "../exceptions"
import {EquipmentModel, Instrument} from "../../utils/ModelEnums";
import {getToken, getUser, Logout, UpdateUser} from "../../auth/auth_utils";
import {User} from "../../utils/dtos";
import {arraysEqual} from "../../app/utils";

export const ParamNames = {
    SEARCH : "search",
    SEARCH_FIELD : "search_field",
    ORDERING : "ordering",
    ID : "pk",
    PAGE_NUMBER : "page"
}

export const NullableFields = [
    ModelFields.EquipmentModelFields.CALIBRATION_MODE
]



export default class RequestUtils {

    /*
    callBack: a function that takes the json of the response as a parameter, to execute when the response successfully returns
    errorCallBack: a function that takes in an error message as a parameter, to execute if an error message is returned
     */

    static assistedFetch(url,
                        method,
                        callBack = (json) => json,
                        errorMessageCallBack = (errorMessage) => errorMessage,
                        header={},
                        params=undefined,
                        data= undefined,
                        expectedJson = true, timeout=undefined) {

        let getMeCallBack = (json) => {
            const user = User.fromJson(json)
            const cookieUser = User.fromJson(getUser())

            if (!arraysEqual(cookieUser.groups, user.groups)) {
                UpdateUser(user)
            } else {
                RequestUtils.performFetch(url, method, callBack, errorMessageCallBack, header, params, data, expectedJson)
            }
        }

        RequestUtils.performFetch(AUTH_URLS.SELF, METHODS.GET, getMeCallBack, Logout, RequestUtils.buildTokenHeader(getToken()))

    }

    static performFetch(url,
                          method,
                          callBack = (json) => json,
                          errorMessageCallBack = (errorMessage) => errorMessage,
                          header={},
                          params=undefined,
                          data= undefined,
                          expectedJson = true, timeout=undefined) {
        if (data && (!(data instanceof FormData) || !expectedJson)) {
            header['Content-Type'] = 'application/json';
            header['Accept'] = 'application/json';
        }
        let init = {
            method: method,
            headers: header,
        }
        const controller = new AbortController();
        const timeoutSetter = setTimeout(() => controller.abort(), timeout);
        if (timeout) {
            init.options = {timeout : timeout}
            init.signal = controller.signal
        }
        if (data) {
            init.body =  data instanceof FormData?
                data :
                JSON.stringify(data)
        }

        fetch(url + RequestUtils.applyRequestParamSuffix(params), init)
            .then(response => {
                if (response.ok) {
                    if (response.status == 204)  // if no content response
                        callBack()
                    else if (!expectedJson) {
                        response.text()
                            .then(text => {
                                if (timeout) clearTimeout(timeoutSetter)
                                callBack(text) // callback is called on the returned json
                            })
                            .catch(error=> {
                                if (timeout) clearTimeout(timeoutSetter)
                                errorMessageCallBack(error.message)
                            })
                    }
                    else {
                        response.json()
                            .then(json => {
                                if (timeout) clearTimeout(timeoutSetter)
                                callBack(json) // callback is called on the returned json
                            })
                            .catch(error=> {
                                if (timeout) clearTimeout(timeoutSetter)
                                errorMessageCallBack(error.message)
                            })
                    }
                } else if (response.status >= 500 && response.status < 600) {
                    response.text()
                        .then(errorText => {
                            if (timeout) clearTimeout(timeoutSetter)
                            if (errorText == "Invalid token") Logout()
                            console.log(new ServerError(errorText).message)
                            alert(new ServerError(errorText).message)
                        })
                } else {
                    response.json()
                        .then(error => {
                            if (timeout) clearTimeout(timeoutSetter)
                            let errorMessage = RequestUtils.parseErrorMessage(error)
                            errorMessageCallBack(errorMessage) // error message callback is called on the returned error message
                        })
                }
            })
            .catch(error => {
                    try {
                        error.text()
                            .then(errorText => {
                                if (timeout) clearTimeout(timeoutSetter)
                                console.log(new ServerError(errorText).message)
                                alert(new ServerError(errorText).message)
                            })
                    } catch (e) {
                        if (error == "TypeError: Failed to fetch") return
                        if (timeout) clearTimeout(timeoutSetter)
                        console.log(new ServerError(error).message)
                        alert(new ServerError(error).message)
                    }
                }
            )

    }



    static async assisted_simple_fetch(url, method, header={}, params=undefined, data= undefined, all_search_fields=false){
        let init = {
            method: method,
            headers: header,
        }

        if (data) {
            init.body = data;
        }
        let response = await fetch(url + RequestUtils.applyRequestParamSuffix(params, all_search_fields), init)
        // .catch(response=>response.text())
        // .then(responsetext =>{
        //     return responsetext
        // })
        if (response.ok) {
            return await response.json()
        } else if (response.status >= 500 && response.status < 600) {
            response.text().then(errorText => {
                alert(new ServerError(errorText).message)
            })
        } else {
            let json = await response.json()
            alert(new UserError(RequestUtils.parseErrorMessage(json)))
        }
    }

    static getWithSearchParams(type,
                                 token,
                                searchParams,
                                callBack = (json) => json,
                                errorMessageCallBack = (errorMessage) => errorMessage,
                                pageNum= undefined,
                                ordering = undefined,
                                exportMode = false,
                                pageSize = undefined) {
            let header = RequestUtils.buildTokenHeader(token)
            searchParams = RequestUtils.removeEmptyFields(searchParams)
            let urlSuffix = RequestUtils.applySearchParams(searchParams, type)
            urlSuffix = RequestUtils.appendToUrlSuffix(urlSuffix, 'page', pageNum)
            urlSuffix = RequestUtils.appendToUrlSuffix(urlSuffix, 'ordering', ordering)
            urlSuffix = RequestUtils.appendToUrlSuffix(urlSuffix, 'pageSize', pageSize)
            let url = undefined
            if (type == ModelFields.ModelTypes.EQUIPMENT_MODEL) {
                url = exportMode ? URLS.EXPORT_MODELS : URLS.MODELS
            } else if (type == ModelFields.ModelTypes.INSTRUMENT) {
                url = exportMode ? URLS.EXPORT_INSTRUMENTS : URLS.INSTRUMENTS
            }
            RequestUtils.assistedFetch(url + urlSuffix,
                METHODS.GET, callBack, errorMessageCallBack, header, undefined, undefined, !exportMode)
    }



    static buildTokenHeader(token) {
        return {
            'Authorization': 'Token ' + token
        }
    }

    // boolean determines whether all the parameters are search fields intended for a partial search
    static applyRequestParamSuffix(paramObj) {
        if (!paramObj || paramObj.size == 0) {
            return ""
        }
        let suffix = "?"
        Object.keys(paramObj).forEach(key => {
            let paramVal = paramObj[key]
            suffix+=key+"="+(Array.isArray(paramVal) ? this.writeArrayParameter(paramVal) : paramVal) +"&"
        })
        return suffix.slice(0, -1) // removes last &
    }

    static writeArrayParameter(array) {
        let suffix = ""
        array.forEach(entry => suffix += entry + ",")
        return suffix.slice(0, -1) //removes last comma
    }

    static applySearchParams(paramObj, ModelType) {
        if (!paramObj || paramObj.size == 0) {
            return ""
        }
        let suffix = "?"
        let addCategoryParameter = (currentSuffix, parameterName, categoryList) => {
            if (categoryList && categoryList.length > 0) {
                currentSuffix += parameterName + "="
            }
            categoryList.forEach(category => {
                currentSuffix += category + ","
            })
            return currentSuffix.slice(0, -1) + "&"
        }
        Object.keys(paramObj).forEach(key => {
            if (key === EquipmentModel.FIELDS.MODEL_CATEGORIES) {
                if (ModelType === EquipmentModel.TYPE) {
                    suffix = addCategoryParameter(suffix, "model_categories__name", paramObj[key])
                } else if (ModelType === Instrument.TYPE) {
                    suffix = addCategoryParameter(suffix, "model__model_categories__name", paramObj[key])
                }
            } else if (key === Instrument.FIELDS.INSTRUMENT_CATEGORIES) {
                suffix = addCategoryParameter(suffix, "instrument_categories__name", paramObj[key])
            } else {
                suffix+=ParamNames.SEARCH+"="+paramObj[key]+"&"
                suffix+=ParamNames.SEARCH_FIELD+"="+key+"&"
            }
        })
        return suffix.slice(0, -1) // removes last &
    }

    static appendToUrlSuffix(urlSuffix, fieldName, value) {
        return urlSuffix + (value ? urlSuffix && urlSuffix.length > 0 ? `&${fieldName}=${value}` : `?${fieldName}=${value}` : '')
    }

    static removeEmptyFields(obj) {
        for (var propName in obj) {
            if (!obj[propName] || obj[propName] == "") {
                delete obj[propName];
            }
        }
        return obj
    }

    static buildGetModelParams(forInstrument, page_num = undefined, vendor = undefined, model_number = undefined,
                                  description = undefined, search = undefined, search_field = undefined,
                                  ordering = undefined) {
        let prefix = forInstrument ? "model__" : ""
        let params = {}
        params[ParamNames.PAGE_NUMBER] = page_num
        params[ParamNames.ORDERING] = ordering
        params[ParamNames.SEARCH] = search
        params[prefix + ParamNames.SEARCH_FIELD] = search_field
        params[prefix + ModelFields.EquipmentModelSearchFields.Vendor] = vendor
        params[prefix + ModelFields.EquipmentModelSearchFields.Description] = description
        params[prefix + ModelFields.EquipmentModelSearchFields["Model Number"]] = model_number
        params = RequestUtils.removeEmptyFields(params)
        return params
    }

    static buildGetInstrumentParams(page_num = undefined, vendor = undefined,
                                       model_number = undefined, description = undefined,
                                       serial_number = undefined, search = undefined,
                                       search_field = undefined, ordering = undefined, asset_tag = undefined) {
        let params = RequestUtils.buildGetModelParams(true, page_num = page_num, vendor = vendor,
            model_number = model_number, description = description, search = search,
            search_field = search_field, ordering = ordering)
        params[ModelFields.InstrumentSearchFields["Serial Number"]] = serial_number
        params[ModelFields.InstrumentSearchFields["Asset Tag"]] = asset_tag
        params = RequestUtils.removeEmptyFields(params)
        return params
    }

    static buildCreateInstrumentData(model_pk, serial_number, comment, asset_tag, instrument_categories, editMode=undefined) {
        let fields = new FormData()
        if (model_pk) fields.append(ModelFields.InstrumentFields.MODEL, model_pk)
            if (serial_number && serial_number != null) fields.append(ModelFields.InstrumentFields.SERIAL_NUMBER, serial_number)
        if ((!serial_number || serial_number == null) && editMode) {
            fields.append(ModelFields.InstrumentFields.SERIAL_NUMBER, '')
        }
        if (comment) fields.append(ModelFields.InstrumentFields.COMMENT, comment)
        if (asset_tag && !editMode) fields.append(Instrument.FIELDS.ASSET_TAG, parseInt(asset_tag))
        if (instrument_categories) {
            instrument_categories.forEach(category => {
                fields.append(ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES, category.name ? category.name : category)
            })
        }
        return fields
    }

   static parseErrorMessage(object) {
        let messageSet = new Set()
        if (object && typeof object === 'string') {
            return object
        } else {
            this.deepSearchObjectForErrorMessages(object, messageSet)
            let message = ""
            messageSet.forEach(mess => message += mess + "\n\n")
            return message
        }
    }

    static deepSearchObjectForErrorMessages(object, messageSet) {
        Object.keys(object).forEach(k => {
            if (object[k] && typeof object[k] === 'string') {
                messageSet.add(object[k])
            } else if (object[k] && typeof object[k] === 'object') {
                RequestUtils.deepSearchObjectForErrorMessages(object[k], messageSet);
            }
        });
    }

    static createFormData(fields) {
        let data = new FormData()
        Object.keys(fields).forEach(key => {
            let val = fields[key]
            if (val || NullableFields.includes(val)) {
                if (key == ModelFields.EquipmentModelFields.MODEL_CATEGORIES ||
                    key == ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES ||
                    key == ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES) {
                    val.forEach(category => {
                        data.append(key, category.name ? category.name : category)
                    })
                } else if (key == ModelFields.EquipmentModelFields.CALIBRATOR_CATEGORIES) {
                    val.forEach(entry => data.append(key, entry))
                } else if (key == ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY) {
                    data.append(key, parseInt(val))
                } else data.append(key, val)
            }
        })
        return data
    }

}