import RequestUtils from "./request_utils";
import {AUTH_URLS, METHODS, URLS} from "../strings";

export default class UserRequests {
    static params;
    static async retrieveUser(token,
                              username,
                              callBack = (json) => json,
                              errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let params = {"username" : username}
        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(AUTH_URLS.USERS,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header,
            params)
    }

    static async getAllUsers(token,
                             callBack = (json) => json,
                             errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        RequestUtils.assistedFetch(AUTH_URLS.USERS,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header)
    }

    static async deactivateUser(token,
                             pk,
                             callBack = (json) => json,
                             errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        RequestUtils.assistedFetch(AUTH_URLS.USERS + pk + '/deactivate',
            METHODS.POST,
            callBack,
            errorMessageCallBack,
            header)
    }

    static async passwordChange(token,
                                password,
                                old_password,
                                callBack = (json) => json,
                                errorMessageCallBack = (errorMessage) => errorMessage){
        let header = RequestUtils.buildTokenHeader(token)
        let params = {"new_password" : password, "re_new_password" : password, "current_password" : old_password}

        RequestUtils.assistedFetch(AUTH_URLS.PASSWORD_CHANGE,
            METHODS.POST,
            callBack,
            errorMessageCallBack,
            header,
            params)
    }


}