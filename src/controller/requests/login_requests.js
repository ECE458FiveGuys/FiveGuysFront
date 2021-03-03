import RequestUtils from "./request_utils";
import {AUTH_URLS, HOSTS, METHODS, URLS} from "../strings";

export default class LoginRequests {
    static async retrieveOAuthToken(code,
                                  callBack = (json) => json,
                                  errorMessageCallBack = (errorMessage) => errorMessage)
    {
        let data = {
            oauth_code : code,
            env : (window.location.host === HOSTS.DEV) ? "dev" :
                  (window.location.host === HOSTS.PROD) ? "prod" :
                  (window.location.host === HOSTS.LOCAL) ? "local" : undefined
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