import RequestUtils from "./request_utils";
import {AUTH_URLS, METHODS, URLS} from "../strings";

export default class LoginRequests {
    static async retrieveOAuthToken(code,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let data = {
            oauth_code : code
        }

        RequestUtils.assistedFetch(AUTH_URLS.GET_OAUTH_TOKEN,
            METHODS.POST,
            callBack,
            errorMessageCallBack,
            undefined,
            undefined,
            data)
    }
}