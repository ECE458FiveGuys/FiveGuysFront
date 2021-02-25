import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";

export default class UserRequests {
    static async retrieveUser(token,
                              username,
                              callBack = (json) => json,
                              errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let params = {"username" : username}
        let header = RequestUtils.buildTokenHeader(token)

        RequestUtils.assistedFetch(URLS.USERS,
            METHODS.GET,
            callBack,
            errorMessageCallBack,
            header,
            params)
    }
}