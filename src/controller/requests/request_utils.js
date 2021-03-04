import ModelFields from "../../utils/enums";
import {METHODS, URLS} from "../strings";
import {ServerError, UserError} from "../exceptions"
import {EquipmentModel, Instrument} from "../../utils/ModelEnums";

export const ParamNames = {
    SEARCH : "search",
    SEARCH_FIELD : "search_field",
    ORDERING : "ordering",
    ID : "pk",
    PAGE_NUMBER : "page"
}

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
                        data= undefined) {
        header['Content-Type'] = 'application/json';
        header['Accept'] = 'application/json';
        let init = {
            method: method,
            headers: header,
        }
        if (data) {
            init.body =  JSON.stringify(data)
        }
        fetch(url + RequestUtils.applyRequestParamSuffix(params), init)
                        .then(response => {
                            if (response.ok) {
                                if (response.status == 204)  // if no content response
                                    callBack()
                                else {
                                    response.json()
                                        .then(json => {
                                            callBack(json) // callback is called on the returned json
                                        })
                                        .catch(error=> {
                                            errorMessageCallBack(error.message)
                                        })
                                }
                            } else if (response.status >= 500 && response.status < 600) {
                                response.text()
                                    .then(errorText => {
                                        alert(new ServerError(errorText).message)
                                    })
                            } else {
                                response.json()
                                    .then(error => {
                                        let errorMessage = RequestUtils.parseErrorMessage(error)
                                        errorMessageCallBack(errorMessage) // error message callback is called on the returned error message
                                    })
                            }
                        })
                        .catch(error => {
                            try {
                                error.text()
                                    .then(errorText => alert(new ServerError(errorText).message))
                            } catch (e) {
                                alert(new ServerError(error).message)
                            }
                            }
                        )

    }

    static async assisted_import_fetch(url, method, header={}, params=undefined, data= undefined, all_search_fields=false){
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

    static async assisted_export_fetch(url, method, header={}, params=undefined, data= undefined, all_search_fields=false){
        let init = {
            method: method,
            headers: header,
        }

        if (data) {
            init.body = data;
        }
        let response = await fetch(url + RequestUtils.applyRequestParamSuffix(params, all_search_fields), init)
        if (response.ok) {
            return response
        } else if (response.status >= 500 && response.status < 600) {
            response.text().then(errorText => {
                alert(new ServerError(errorText).message)
            })
        } else {
            let json = await response.text()
            throw new UserError(RequestUtils.parseErrorMessage(json))
        }
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
            suffix+=key+"="+paramObj[key]+"&"
        })
        return suffix.slice(0, -1) // removes last &
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


    static removeEmptyFields(obj) {
        for (var propName in obj) {
            if (!obj[propName] || obj[propName] == "") {
                delete obj[propName];
            }
        }
        return obj
    }

    static buildGetModelParams(page_num = undefined, vendor = undefined, model_number = undefined,
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
        params = RequestUtils.removeEmptyFields(params)
        return params
    }

    static buildGetInstrumentParams(page_num = undefined, vendor = undefined,
                                       model_number = undefined, description = undefined,
                                       serial_number = undefined, search = undefined,
                                       search_field = undefined, ordering = undefined) {
        let params = RequestUtils.buildGetModelParams(page_num = page_num, vendor = vendor,
            model_number = model_number, description = description, search = search,
            search_field = search_field, ordering = ordering)
        params[ModelFields.InstrumentSearchFields["Serial Number"]] = serial_number
        return params
    }

    static buildCreateInstrumentData(model_pk, serial_number, comment) {
        let fields = {}
        fields[ModelFields.InstrumentFields.MODEL] = model_pk
        fields[ModelFields.InstrumentFields.SERIAL_NUMBER] = serial_number
        fields[ModelFields.InstrumentFields.COMMENT] = comment
        return RequestUtils.removeEmptyFields(fields)
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

}