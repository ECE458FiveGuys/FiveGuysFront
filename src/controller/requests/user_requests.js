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

    static async getAllUsers(token)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.USERS,
            METHODS.GET, header)
    }

    static async deactivateUser(token,
                             pk)
    {
        let header = RequestUtils.buildTokenHeader(token)
        //let params = {}
        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.USERS + pk + '/deactivate',
            METHODS.POST,
            header)
    }

    static async passwordChange(token,
                                password,
                                old_password){
        let header = RequestUtils.buildTokenHeader(token)
        let data = {"new_password" : password, "re_new_password" : password, "current_password" : old_password}

        return await RequestUtils.assisted_simple_fetch(AUTH_URLS.PASSWORD_CHANGE,
            METHODS.POST,
            header,
            {},
            data)
    }
}