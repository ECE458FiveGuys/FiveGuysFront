import RequestUtils from "./request_utils";
import {AUTH_URLS, METHODS, URLS} from "../strings";

export default class UserRequests {
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
}